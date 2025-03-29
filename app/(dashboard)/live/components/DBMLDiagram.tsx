"use client";

import { useState, useMemo, memo, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  Panel,
  ConnectionMode,
  MarkerType,
  Position,
  MiniMap,
} from "reactflow";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Info,
  XIcon,
  Share2,
  Download,
  Save,
  History,
  Layout,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import dagre from "dagre";
import {
  DatabaseSchemaNode,
  DatabaseSchemaNodeHeader,
  DatabaseSchemaNodeBody,
  DatabaseSchemaTableRow,
  DatabaseSchemaTableCell,
} from "@/components/database-schema-node";
import { LabeledHandle } from "@/components/labeled-handle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import "reactflow/dist/style.css";

interface TableField {
  name: string;
  type: string;
  constraints: string[];
}

interface TableNode {
  id: string;
  name: string;
  fields: TableField[];
}

interface DBMLDiagramProps {
  nodes: TableNode[];
  edges: Edge[];
}

interface DiagramControls {
  layout: "LR" | "TB" | "RL" | "BT";
  theme: "light" | "dark" | "system";
  showMinimap: boolean;
  showGrid: boolean;
  animate: boolean;
}

function processEdges(inputEdges: any[]) {
  if (!inputEdges || !Array.isArray(inputEdges)) {
    console.warn("Invalid edges input:", inputEdges);
    return [];
  }

  return inputEdges.map((edge) => {
    const sourceHandleId = `${edge.source}-${edge.sourceField}`;
    const targetHandleId = `${edge.target}-${edge.targetField}`;

    return {
      id: `${edge.source}-${edge.target}-${edge.sourceField}`,
      source: edge.source,
      target: edge.target,
      sourceHandle: sourceHandleId,
      targetHandle: targetHandleId,
      type: "smoothstep",
      animated: true,
      style: {
        strokeWidth: 2,
        stroke: "hsl(var(--primary))",
      },
      label: (
        <div className="bg-background/95 backdrop-blur-sm px-2 py-1 rounded-lg border shadow-sm">
          <div className="text-[10px] font-medium">
            {edge.relationshipType.type === "one-to-one" ? (
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                1:1
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                1:N
              </span>
            )}
          </div>
          <div className="text-[9px] text-muted-foreground">
            {edge.sourceField} → {edge.targetField}
          </div>
        </div>
      ),
    };
  });
}

const SchemaNode = memo(
  ({ data, selected }: { data: any; selected?: boolean }) => {
    console.log("Rendering node:", data.label, data.schema);

    return (
      <DatabaseSchemaNode selected={selected}>
        <DatabaseSchemaNodeHeader>
          <div className="flex items-center justify-between">
            <span>{data.label}</span>
            <span className="text-xs bg-primary/10 px-2 py-1 rounded-full">
              {data.schema.length} fields
            </span>
          </div>
        </DatabaseSchemaNodeHeader>
        <DatabaseSchemaNodeBody>
          {data.schema.map((field: any) => {
            const handleId = `${data.label}-${field.title}`;

            console.log("Creating handles for field:", {
              nodeId: data.label,
              fieldName: field.title,
              handleId,
            });

            return (
              <DatabaseSchemaTableRow key={field.title}>
                <DatabaseSchemaTableCell className="pl-1 pr-6">
                  <LabeledHandle
                    id={handleId}
                    title={field.title}
                    type="target"
                    position={Position.Left}
                  />
                </DatabaseSchemaTableCell>
                <DatabaseSchemaTableCell className="pr-1">
                  <LabeledHandle
                    id={handleId}
                    title={field.type}
                    type="source"
                    position={Position.Right}
                    labelClassName="text-right w-full pr-3"
                  />
                </DatabaseSchemaTableCell>
              </DatabaseSchemaTableRow>
            );
          })}
        </DatabaseSchemaNodeBody>
      </DatabaseSchemaNode>
    );
  }
);

SchemaNode.displayName = "SchemaNode";

const nodeTypes = {
  schemaNode: SchemaNode,
};

function getLayoutedElements(
  nodes: TableNode[],
  edges: Edge[],
  direction = "LR"
) {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const calculateNodeDimensions = (node: TableNode) => {
    const baseHeight = 80;
    const fieldHeight = 40;
    const totalHeight = baseHeight + node.fields.length * fieldHeight;
    const width = 320; // Increased width
    return { width, height: totalHeight };
  };

  dagreGraph.setGraph({
    rankdir: direction,
    align: "DL",
    nodesep: 180, // Increased spacing
    ranksep: 300, // Increased spacing
    edgesep: 150,
    marginx: 100,
    marginy: 100,
    acyclicer: "greedy",
    ranker: "network-simplex",
  });

  // Add nodes with calculated dimensions
  nodes.forEach((node) => {
    const { width, height } = calculateNodeDimensions(node);
    dagreGraph.setNode(node.id, { width, height });
  });

  // Add edges
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Layout the graph
  dagre.layout(dagreGraph);

  // Create the positioned nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const { width, height } = calculateNodeDimensions(node);

    return {
      id: node.id,
      type: "schemaNode",
      data: {
        label: node.name,
        schema: node.fields.map((field) => ({
          title: field.name,
          type: field.type,
        })),
      },
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: {
        width: `${width}px`,
        height: `${height}px`,
      },
    };
  });

  // Collision detection and adjustment
  for (let i = 0; i < layoutedNodes.length; i++) {
    for (let j = i + 1; j < layoutedNodes.length; j++) {
      const nodeA = layoutedNodes[i];
      const nodeB = layoutedNodes[j];

      const dx = nodeA.position.x - nodeB.position.x;
      const dy = nodeA.position.y - nodeB.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = 350;

      if (distance < minDistance) {
        const angle = Math.atan2(dy, dx);
        const overlap = minDistance - distance;

        nodeB.position.x -= Math.cos(angle) * overlap * 0.5;
        nodeB.position.y -= Math.sin(angle) * overlap * 0.5;
        nodeA.position.x += Math.cos(angle) * overlap * 0.5;
        nodeA.position.y += Math.sin(angle) * overlap * 0.5;
      }
    }
  }

  return layoutedNodes;
}

const FullscreenDialog = ({ children }: { children: React.ReactNode }) => (
  <DialogContent
    className="w-screen h-screen max-w-none !max-w-none sm:!max-w-none md:!max-w-none lg:!max-w-none p-0 m-0 rounded-none border-none"
    style={{ maxWidth: "100vw" }}
  >
    {children}
  </DialogContent>
);

export default function DBMLDiagram({ nodes, edges }: DBMLDiagramProps) {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showZoomDialog, setShowZoomDialog] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [controls, setControls] = useState<DiagramControls>({
    layout: "LR",
    theme: "system",
    showMinimap: true,
    showGrid: true,
    animate: true,
  });

  useEffect(() => {
    console.log("Initial nodes:", nodes);
    console.log("Initial edges:", edges);
  }, [nodes, edges]);

  const processedEdges = useMemo(() => {
    return processEdges(edges || []);
  }, [edges]);

  const layoutedNodes = useMemo(() => {
    if (!nodes || !edges) return [];
    return getLayoutedElements(nodes, edges);
  }, [nodes, edges]);

  const handleFullscreen = () => {
    const element = document.querySelector(".diagram-container");
    if (!element) return;

    if (!isFullscreen) {
      element.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const InfoPanel = () => (
    <div className="bg-background/95 backdrop-blur-sm p-4 rounded-lg border shadow-lg w-80">
      <h3 className="font-semibold mb-2">Relationship Guide</h3>
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center border rounded">
            <div className="w-2 h-2 bg-primary rounded-full" />
          </div>
          <span>Required (1)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center border rounded">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path
                d="M2 10h16M2 6v8"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
          <span>One-to-One Relationship</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center border rounded">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path
                d="M2 10h16M18 6v8M2 6v8"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
          <span>One-to-Many Relationship</span>
        </div>
      </div>
    </div>
  );

  const DiagramToolbar = () => (
    <Panel position="top-right" className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="bg-background">
            <Layout className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Layout Direction</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => setControls((c) => ({ ...c, layout: "LR" }))}
          >
            Left to Right
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setControls((c) => ({ ...c, layout: "TB" }))}
          >
            Top to Bottom
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="bg-background">
            <Settings className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Visualization</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              setControls((c) => ({ ...c, showMinimap: !c.showMinimap }))
            }
          >
            {controls.showMinimap ? "Hide" : "Show"} Minimap
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              setControls((c) => ({ ...c, showGrid: !c.showGrid }))
            }
          >
            {controls.showGrid ? "Hide" : "Show"} Grid
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setControls((c) => ({ ...c, animate: !c.animate }))}
          >
            {controls.animate ? "Disable" : "Enable"} Animation
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="icon"
        className="bg-background"
        onClick={() => setShowHelp(!showHelp)}
      >
        <Info className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="bg-background"
        onClick={() => setShowZoomDialog(true)}
      >
        <Maximize2 className="h-4 w-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="bg-background">
            <Download className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Export</DropdownMenuLabel>
          <DropdownMenuItem>PNG Image</DropdownMenuItem>
          <DropdownMenuItem>SVG Vector</DropdownMenuItem>
          <DropdownMenuItem>PDF Document</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Panel>
  );

  return (
    <>
      <div className="diagram-container w-full h-[800px] border rounded-lg overflow-hidden relative">
        <ReactFlow
          nodes={layoutedNodes}
          edges={processedEdges}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Strict}
          fitView
          fitViewOptions={{ padding: 0.5 }}
          defaultEdgeOptions={{
            type: "smoothstep",
            animated: true,
          }}
          onNodesChange={(changes) => {
            console.log("Nodes changed:", changes);
          }}
          onEdgesChange={(changes) => {
            console.log("Edges changed:", changes);
          }}
          onError={(error) => {
            console.error("ReactFlow error:", error);
          }}
        >
          <Background
            gap={20}
            size={1.5}
            color="hsl(var(--primary))"
            style={{ opacity: 0.2 }}
          />
          <Controls
            className="bg-background border"
            showInteractive={true}
            fitViewOptions={{ padding: 0.5 }}
          />
          {controls.showMinimap && (
            <MiniMap
              nodeColor="hsl(var(--primary))"
              className="bg-background/80 border"
            />
          )}

          <DiagramToolbar />

          {/* Top Toolbar */}
          <Panel position="top-right" className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowHelp(!showHelp)}
              className="bg-background"
            >
              <Info className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowZoomDialog(true)}
              className="bg-background"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </Panel>

          {/* Info Panel */}
          {showHelp && (
            <Panel position="top-center" className="mt-20">
              <InfoPanel />
            </Panel>
          )}

          {/* Schema Overview */}
          <Panel
            position="top-left"
            className="bg-background/95 backdrop-blur-sm p-3 rounded-lg border shadow-sm"
          >
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium">Schema Overview</div>
              <div className="text-xs text-muted-foreground">
                {nodes.length} Tables • {edges.length} Relationships
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Fullscreen Dialog */}
      <Dialog
        open={showZoomDialog}
        onOpenChange={setShowZoomDialog}
        modal={true}
      >
        <FullscreenDialog>
          <div className="relative w-full h-full">
            <div className="absolute right-4 top-4 z-50">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowZoomDialog(false)}
                className="bg-background/95 backdrop-blur-sm"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
            <ReactFlow
              nodes={layoutedNodes}
              edges={processedEdges}
              nodeTypes={nodeTypes}
              connectionMode={ConnectionMode.Loose}
              fitView
              fitViewOptions={{
                padding: 0.2,
                includeHiddenNodes: true,
              }}
              minZoom={0.1}
              maxZoom={2}
              defaultViewport={{ zoom: 1, x: 0, y: 0 }}
              panOnDrag
              zoomOnScroll
              panOnScroll
              preventScrolling={false}
            >
              <Background gap={20} size={1} />
              <Controls position="bottom-right" />
              <Panel
                position="top-left"
                className="bg-background/95 backdrop-blur-sm p-3 rounded-lg border shadow-sm"
              >
                <div className="text-sm font-medium">
                  {nodes.length} Tables • {edges.length} Relationships
                </div>
              </Panel>
            </ReactFlow>
          </div>
        </FullscreenDialog>
      </Dialog>
    </>
  );
}
