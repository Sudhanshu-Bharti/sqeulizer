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
  Handle,
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
  Key,
  Hash,
  Link2,
  CircleDot,
  Lock,
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
  edges: any[];
}

interface DiagramControls {
  layout: "LR" | "TB" | "RL" | "BT";
  theme: "light" | "dark" | "system";
  showMinimap: boolean;
  showGrid: boolean;
  animate: boolean;
}

const SchemaNode = memo(
  ({ data, selected }: { data: any; selected?: boolean }) => {
    // Log node data for debugging handles
    // console.log(`SchemaNode Render: ${data.label}`, data);

    return (
      <DatabaseSchemaNode selected={selected}>
        <DatabaseSchemaNodeHeader>
          <div className="flex items-center justify-between p-3 bg-muted/50">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-base">{data.label}</span>
            </div>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {data.schema.length} columns
            </span>
          </div>
        </DatabaseSchemaNodeHeader>
        <DatabaseSchemaNodeBody>
          {data.schema.map((field: any) => {
            const targetHandleId = `${data.label}-${field.title}-target`;
            const sourceHandleId = `${data.label}-${field.title}-source`;
            // Log exact handle IDs being rendered
            // console.log(`  Field: ${field.title}, Target ID: ${targetHandleId}, Source ID: ${sourceHandleId}`);

            return (
              <div key={field.title} className="relative">
                <DatabaseSchemaTableRow>
                  <DatabaseSchemaTableCell className="flex items-center gap-2 px-4 py-2 hover:bg-muted/50 rounded-md group transition-colors">
                    <div className="flex items-center gap-1.5 min-w-[20px]">
                      {field.constraints?.includes("composite-pk") && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Key className="h-3.5 w-3.5 text-amber-500" />
                          </TooltipTrigger>
                          <TooltipContent>Part of Composite Primary Key</TooltipContent>
                        </Tooltip>
                      )}
                      {field.constraints?.includes("pk") && !field.constraints?.includes("composite-pk") && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Key className="h-3.5 w-3.5 text-amber-500" />
                          </TooltipTrigger>
                          <TooltipContent>Primary Key</TooltipContent>
                        </Tooltip>
                      )}
                      {field.constraints?.includes("fk") && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Link2 className="h-3.5 w-3.5 text-blue-500" />
                          </TooltipTrigger>
                          <TooltipContent>Foreign Key</TooltipContent>
                        </Tooltip>
                      )}
                      {field.constraints?.includes("unique") && (
                        <Tooltip>
                          <TooltipTrigger>
                            <CircleDot className="h-3.5 w-3.5 text-violet-500" />
                          </TooltipTrigger>
                          <TooltipContent>Unique</TooltipContent>
                        </Tooltip>
                      )}
                      {field.constraints?.includes("not null") && (
                        <Tooltip>
                          <TooltipTrigger>
                            <CircleDot className="h-3.5 w-3.5 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent>Not Null</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-sm group-hover:text-primary transition-colors">
                        {field.title}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground font-mono">
                        {field.type}
                      </span>
                    </div>
                  </DatabaseSchemaTableCell>
                </DatabaseSchemaTableRow>
                <Handle
                  type="target"
                  position={Position.Left}
                  id={targetHandleId}
                  style={{ background: "#555", top: "50%", transform: "translateY(-50%)" }}
                  isConnectable={true}
                />
                <Handle
                  type="source"
                  position={Position.Right}
                  id={sourceHandleId}
                  style={{ background: "#555", top: "50%", transform: "translateY(-50%)" }}
                  isConnectable={true}
                />
              </div>
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
  edges: any[],
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
  });

  // Add nodes with calculated dimensions
  nodes.forEach((node) => {
    const { width, height } = calculateNodeDimensions(node);
    dagreGraph.setNode(node.id, { width, height });
  });

  // Add edges
  edges.forEach((edge) => {
    if (edge.source && edge.target) {
      dagreGraph.setEdge(edge.source, edge.target);
    }
  });

  // Layout the graph
  dagre.layout(dagreGraph);

  // Create the positioned nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    if (!nodeWithPosition) {
      return {
        id: node.id,
        type: "schemaNode",
        data: {
          label: node.name,
          schema: node.fields.map((field) => ({
            title: field.name,
            type: field.type,
            constraints: field.constraints,
          })),
        },
        position: { x: 0, y: 0 },
      };
    }

    const { width, height } = calculateNodeDimensions(node);

    return {
      id: node.id,
      type: "schemaNode",
      data: {
        label: node.name,
        schema: node.fields.map((field) => ({
          title: field.name,
          type: field.type,
          constraints: field.constraints,
        })),
      },
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2,
      },
      style: {
        width: `${width}px`,
        height: `${height}px`,
      },
    };
  });

  return layoutedNodes;
}

function processEdges(inputEdges: any[]) {
  if (!inputEdges?.length) return [];

  return inputEdges.map((edge) => ({
    id: `edge-${edge.source}-${edge.sourceField}-${edge.target}-${edge.targetField}`,
    source: edge.source,
    target: edge.target,
    sourceHandle: `${edge.source}-${edge.sourceField}-source`,
    targetHandle: `${edge.target}-${edge.targetField}-target`,
    type: "smoothstep",
    animated: true,
    style: {
      strokeWidth: 2,
      stroke: "#FFC6A21",
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#FFC6A21",
    },
    label: (
      <div className="bg-background/95 backdrop-blur-sm px-2 py-1 rounded-lg border shadow-sm">
        <div className="flex items-center gap-2 text-[10px]">
          <Link2 className="h-3 w-3 text-muted-foreground" />
          <span className="font-medium">{edge.sourceField || ""}</span>
          <span className="text-muted-foreground">→</span>
          <span className="font-medium">{edge.targetField || ""}</span>
        </div>
      </div>
    ),
  }));
}

const FullscreenDialog = ({ children }: { children: React.ReactNode }) => (
  <DialogContent
    className="w-screen h-screen !max-w-none sm:!max-w-none md:!max-w-none lg:!max-w-none p-0 m-0 rounded-none border-none"
    style={{ maxWidth: "100vw" }}
  >
    {children}
  </DialogContent>
);

export default function DBMLDiagram({ nodes, edges }: DBMLDiagramProps) {
  // Log raw props (without stringify)
  console.log("Raw props nodes:", nodes);
  console.log("Raw props edges:", edges);

  // const [zoom, setZoom] = useState(1);
  // const [isFullscreen, setIsFullscreen] = useState(false);
  const [showZoomDialog, setShowZoomDialog] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showTip, setShowTip] = useState(true);
  const [controls, setControls] = useState<DiagramControls>({
    layout: "BT",
    theme: "system",
    showMinimap: true,
    showGrid: true,
    animate: true,
  });

  const safeNodes = useMemo(() => {
    return Array.isArray(nodes) ? nodes : [];
  }, [nodes]);

  const safeEdges = useMemo(() => {
    return Array.isArray(edges) ? edges : [];
  }, [edges]);

  useEffect(() => {
    console.log("Initial nodes:", safeNodes);
    console.log("Initial edges:", safeEdges);
  }, [safeNodes, safeEdges]);

  useEffect(() => {
    if (showTip) {
      const timer = setTimeout(() => setShowTip(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showTip]);

  const processedEdges = useMemo(() => {
    const result = processEdges(safeEdges);
    // Log processed edges (without stringify)
    console.log("Processed Edges for React Flow:", result);
    return result;
  }, [safeEdges]);

  const layoutedNodes = useMemo(() => {
    if (!safeNodes.length) return [];
    return getLayoutedElements(safeNodes, safeEdges, controls.layout);
  }, [safeNodes, safeEdges, controls.layout]);

  const InfoPanel = () => (
    <div className="bg-background/95 backdrop-blur-sm p-4 rounded-lg border shadow-lg w-80">
      <h3 className="font-semibold mb-2">Relationship Guide</h3>
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center border rounded">
            <Key className="h-4 w-4 text-amber-500" />
          </div>
          <span>Primary Key</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center border rounded">
            <Link2 className="h-4 w-4 text-blue-500" />
          </div>
          <span>Foreign Key Relationship</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center border rounded">
            <CircleDot className="h-4 w-4 text-violet-500" />
          </div>
          <span>Unique Constraint</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="diagram-container w-full h-[800px] border rounded-lg overflow-hidden relative bg-white dark:bg-gray-900">
        <ReactFlow
          nodes={layoutedNodes}
          edges={processedEdges}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          defaultEdgeOptions={{
            type: "smoothstep",
            animated: true,
          }}
        >
          <Background
            gap={20}
            size={1.5}
            color="hsl(var(--primary))"
            style={{ opacity: 0.1 }}
          />
          <Controls
            className="bg-background border flex flex-row"
            position="top-center"
            showInteractive={true}
            fitViewOptions={{ padding: 1 }}
          />
          {controls.showMinimap && (
            <MiniMap
              nodeColor="hsl(var(--primary))"
              className="bg-background/80 border"
            />
          )}

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
                <DropdownMenuItem
                  onClick={() => setControls((c) => ({ ...c, layout: "RL" }))}
                >
                  Right to Left
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setControls((c) => ({ ...c, layout: "BT" }))}
                >
                  Bottom to Top
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
                {safeNodes.length} Tables • {safeEdges.length} Relationships
              </div>
            </div>
          </Panel>

          {/* Zoom Tip */}
          {showTip && (
            <Panel position="bottom-center" className="mb-4">
              <div className="bg-background/95 backdrop-blur-sm px-3 py-2 rounded-lg border shadow-sm flex items-center gap-2 text-sm animate-fade-in-up">
                <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                  <span className="font-medium">Ctrl</span>
                  <span>+</span>
                  <ZoomIn className="h-3.5 w-3.5" />
                </div>
                <span className="text-muted-foreground">
                  Use mouse wheel to zoom in/out
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 ml-2"
                  onClick={() => setShowTip(false)}
                >
                  <XIcon className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Panel>
          )}
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
              <Background className="bg-white/20" gap={20} size={1} />
              <Controls position="bottom-right" />
              <Panel
                position="top-left"
                className="bg-background/95 backdrop-blur-sm p-3 rounded-lg border shadow-sm"
              >
                <div className="text-sm font-medium">
                  {safeNodes.length} Tables • {safeEdges.length} Relationships
                </div>
              </Panel>
            </ReactFlow>
          </div>
        </FullscreenDialog>
      </Dialog>
    </>
  );
}
