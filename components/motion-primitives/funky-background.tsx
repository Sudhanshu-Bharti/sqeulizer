"use client";

import { useEffect, useRef } from "react";

interface DbShape {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  type: "table" | "relation" | "dataflow";
  color: string;
  connections: number[];
  name: string;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
  rotation: number;
  rotationSpeed: number;
  active: boolean;
  activeTime: number;
}

export function FunkyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Set canvas dimensions with device pixel ratio for sharper rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(dpr, dpr);

    // Modern SaaS theme color palette
    const theme = {
      primary: "#7c3aed", // Purple
      secondary: "#3b82f6", // Blue
      accent: "#10b981", // Green
      highlight: "#f472b6", // Pink
      neutral: "#6b7280", // Gray
      background: "#0f172a", // Dark blue
      dark: "#020617", // Very dark blue
      light: "#f8fafc", // Light gray
    };

    // Modern SaaS-y names
    const productNames = [
      "Analytics",
      "Users",
      "Billing",
      "Metrics",
      "Reports",
      "Integrations",
      "Tasks",
      "Workflows",
      "Projects",
      "Teams",
      "Notifications",
      "Settings",
    ];

    const shapes: DbShape[] = [];
    let time = 0;
    let focusIndex = 0;
    const activationInterval = 300; // How often to activate a new node

    // Create initial shapes with better distribution
    const createShape = (isTable: boolean, index: number): DbShape => {
      // Create grid-based arrangement for SaaS dashboard feel
      const gridCols = 6;
      const gridRows = 4;
      const gridWidth = canvas.width / (dpr * gridCols);
      const gridHeight = canvas.height / (dpr * gridRows);

      // Add slight randomness to grid position
      const col = index % gridCols;
      const row = Math.floor(index / gridCols) % gridRows;
      const randomOffset = 80;

      // Base position from grid
      const baseX = gridWidth * (col + 0.5);
      const baseY = gridHeight * (row + 0.5);

      // Add randomness
      const x = baseX + (Math.random() - 0.5) * randomOffset;
      const y = baseY + (Math.random() - 0.5) * randomOffset;

      // Determine shape type with more tables for SaaS feeling
      const type =
        isTable || Math.random() > 0.7
          ? "table"
          : Math.random() > 0.5
          ? "relation"
          : "dataflow";

      // Pick color based on type for more SaaS feeling
      let color;
      if (type === "table") {
        color = Math.random() > 0.5 ? theme.primary : theme.secondary;
      } else if (type === "relation") {
        color = Math.random() > 0.5 ? theme.highlight : theme.accent;
      } else {
        color = theme.neutral;
      }

      return {
        x,
        y,
        size:
          type === "table" ? 40 + Math.random() * 20 : 15 + Math.random() * 10,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: (Math.random() - 0.5) * 0.15,
        type,
        color,
        connections: [],
        name: type === "table" ? productNames[index % productNames.length] : "",
        opacity: 0.2 + Math.random() * 0.3,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.005 + Math.random() * 0.015,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.005,
        active: false,
        activeTime: 0,
      };
    };

    // Create shapes - more tables for SaaS feel
    const tableCount = 10;
    const relationCount = 8;
    const dataflowCount = 6;

    // Create tables first
    for (let i = 0; i < tableCount; i++) {
      shapes.push(createShape(true, i));
    }

    // Add relation and dataflow nodes
    for (let i = 0; i < relationCount + dataflowCount; i++) {
      shapes.push(createShape(false, i + tableCount));
    }

    // Create smarter connections
    shapes.forEach((shape, idx) => {
      if (shape.type === "table") {
        // Connect tables to 2-3 relations or dataflows
        const connCount = 2 + Math.floor(Math.random() * 2);
        const potentialTargets = shapes.filter(
          (s) => s.type !== "table" && s.connections.length < 3
        );

        for (let i = 0; i < Math.min(connCount, potentialTargets.length); i++) {
          const targetIdx = shapes.indexOf(
            potentialTargets[
              Math.floor(Math.random() * potentialTargets.length)
            ]
          );

          if (!shape.connections.includes(targetIdx) && targetIdx !== idx) {
            shape.connections.push(targetIdx);
            shapes[targetIdx].connections.push(idx);
          }
        }
      }
    });

    // Make sure every node has at least one connection
    shapes.forEach((shape, idx) => {
      if (shape.connections.length === 0) {
        // Find a suitable target
        const targetIdx = shapes.findIndex(
          (s, i) => i !== idx && s.type !== shape.type
        );

        if (targetIdx !== -1) {
          shape.connections.push(targetIdx);
          shapes[targetIdx].connections.push(idx);
        }
      }
    });

    function drawGlow(
      x: number,
      y: number,
      radius: number,
      color: string,
      intensity: number = 0.5
    ) {
      if (!ctx) return;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      const alphaVal = Math.floor(intensity * 255)
        .toString(16)
        .padStart(2, "0");

      gradient.addColorStop(0, color + alphaVal);
      gradient.addColorStop(1, color + "00");

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    function drawShape(shape: DbShape) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);

      // Update pulse and rotation
      shape.pulse = (shape.pulse + shape.pulseSpeed) % (Math.PI * 2);
      shape.rotation += shape.rotationSpeed;

      // Calculate pulse effect
      const isActive = shape.active;
      const activeRatio = Math.min(shape.activeTime / 60, 1);
      const basePulse = Math.sin(shape.pulse) * 0.4 + 0.6;
      const pulseOpacity = basePulse * shape.opacity * (isActive ? 1.5 : 1);

      // Apply scale if active
      const scale = isActive ? 1 + activeRatio * 0.2 : 1;
      ctx.scale(scale, scale);

      // Draw glow for active nodes
      if (isActive) {
        drawGlow(0, 0, shape.size * 2, shape.color, 0.3 * activeRatio);
      }

      switch (shape.type) {
        case "table":
          // Draw table node with modern SaaS style
          const padding = 6;
          const headerHeight = 20;
          const borderRadius = 8;

          // Main rectangle with shadow
          if (isActive) {
            ctx.shadowColor = shape.color + "90";
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
          }

          // Create table shape
          ctx.beginPath();
          ctx.roundRect(
            -shape.size / 2,
            -shape.size / 2,
            shape.size,
            shape.size,
            borderRadius
          );

          // Fill with modern gradient
          const gradient = ctx.createLinearGradient(
            -shape.size / 2,
            -shape.size / 2,
            shape.size / 2,
            shape.size / 2
          );

          const colorOpacity = Math.floor(pulseOpacity * 255)
            .toString(16)
            .padStart(2, "0");
          gradient.addColorStop(0, shape.color + colorOpacity);
          gradient.addColorStop(1, shape.color + "40");

          ctx.fillStyle = gradient;
          ctx.fill();

          // Add subtle border
          ctx.strokeStyle = isActive ? theme.light + "40" : shape.color + "60";
          ctx.lineWidth = isActive ? 1.5 : 0.5;
          ctx.stroke();

          // Remove shadow for inner elements
          ctx.shadowColor = "transparent";

          // Header separator
          ctx.beginPath();
          ctx.moveTo(-shape.size / 2 + padding, -shape.size / 2 + headerHeight);
          ctx.lineTo(shape.size / 2 - padding, -shape.size / 2 + headerHeight);
          ctx.strokeStyle = "#ffffff30";
          ctx.lineWidth = 0.5;
          ctx.stroke();

          // Table name
          ctx.fillStyle = isActive ? "#ffffff" : "#ffffffa0";
          ctx.font = `${isActive ? "bold " : ""}11px sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText(shape.name, 0, -shape.size / 2 + 14);

          // Decorative elements - data indicators
          const rowCount = 3;
          const rowHeight =
            (shape.size - headerHeight - padding * 2) / rowCount;

          for (let i = 0; i < rowCount; i++) {
            const y =
              -shape.size / 2 + headerHeight + padding + rowHeight * (i + 0.5);

            // Row highlight if active
            if (isActive && i === 1) {
              ctx.fillStyle = theme.light + "15";
              ctx.fillRect(
                -shape.size / 2 + padding,
                -shape.size / 2 + headerHeight + rowHeight * i,
                shape.size - padding * 2,
                rowHeight
              );
            }

            // Data indicators
            ctx.fillStyle = "#ffffff20";
            ctx.fillRect(
              -shape.size / 2 + padding * 2,
              y - 2,
              shape.size * 0.3,
              4
            );

            // Second data indicator
            ctx.fillStyle = "#ffffff15";
            ctx.fillRect(shape.size * 0.1, y - 2, shape.size * 0.2, 4);
          }
          break;

        case "relation":
          // Draw relation node with modern style
          if (isActive) {
            ctx.shadowColor = shape.color + "90";
            ctx.shadowBlur = 12;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
          }

          // Diamond shape
          ctx.beginPath();
          ctx.moveTo(0, -shape.size / 1.5);
          ctx.lineTo(shape.size / 1.5, 0);
          ctx.lineTo(0, shape.size / 1.5);
          ctx.lineTo(-shape.size / 1.5, 0);
          ctx.closePath();

          // Fill with modern gradient
          const relGradient = ctx.createRadialGradient(
            0,
            0,
            0,
            0,
            0,
            shape.size / 1.5
          );

          relGradient.addColorStop(
            0,
            shape.color +
              Math.floor(pulseOpacity * 255)
                .toString(16)
                .padStart(2, "0")
          );
          relGradient.addColorStop(1, shape.color + "40");

          ctx.fillStyle = relGradient;
          ctx.fill();

          // Add subtle border
          ctx.strokeStyle = isActive ? theme.light + "60" : shape.color + "60";
          ctx.lineWidth = isActive ? 1.5 : 0.5;
          ctx.stroke();

          // Add center dot
          if (isActive) {
            ctx.beginPath();
            ctx.arc(0, 0, shape.size / 6, 0, Math.PI * 2);
            ctx.fillStyle = theme.light + "80";
            ctx.fill();
          }
          break;

        case "dataflow":
          // Draw data flow indicator with modern style
          if (isActive) {
            ctx.shadowColor = shape.color + "90";
            ctx.shadowBlur = 12;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
          }

          // Main circle
          ctx.beginPath();
          ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);

          // Fill with modern gradient
          const flowGradient = ctx.createRadialGradient(
            0,
            0,
            0,
            0,
            0,
            shape.size / 2
          );

          flowGradient.addColorStop(
            0,
            shape.color +
              Math.floor(pulseOpacity * 255)
                .toString(16)
                .padStart(2, "0")
          );
          flowGradient.addColorStop(1, shape.color + "40");

          ctx.fillStyle = flowGradient;
          ctx.fill();

          // Add subtle border
          ctx.strokeStyle = isActive ? theme.light + "60" : shape.color + "60";
          ctx.lineWidth = isActive ? 1.5 : 0.5;
          ctx.stroke();

          // Add concentric circles
          if (isActive) {
            ctx.beginPath();
            ctx.arc(0, 0, shape.size / 3, 0, Math.PI * 2);
            ctx.strokeStyle = theme.light + "40";
            ctx.lineWidth = 0.5;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, shape.size / 6, 0, Math.PI * 2);
            ctx.fillStyle = theme.light + "30";
            ctx.fill();
          }
          break;
      }

      ctx.restore();
    }

    function drawConnections() {
      shapes.forEach((shape, shapeIdx) => {
        shape.connections.forEach((targetIndex) => {
          const target = shapes[targetIndex];
          if (!target) return;

          const dx = target.x - shape.x;
          const dy = target.y - shape.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (!canvas) return;
          // Only draw connections within reasonable distance
          if (distance < canvas.width / (dpr * 2)) {
            // Determine if this connection should be highlighted
            const isActive = shape.active || target.active;

            // Calculate control points for bezier curve
            // Make curves more pronounced for SaaS look
            const controlPointOffset =
              40 + Math.sin(time * 0.01 + shapeIdx * 0.5) * 15;
            const midX = (shape.x + target.x) / 2;
            const midY = (shape.y + target.y) / 2 - controlPointOffset;

            // Draw connection with bezier curve
            if (!ctx) return;
            ctx.beginPath();
            ctx.moveTo(shape.x, shape.y);
            ctx.quadraticCurveTo(midX, midY, target.x, target.y);

            // Determine connection style
            if (isActive) {
              ctx.shadowColor = theme.light + "40";
              ctx.shadowBlur = 5;
              ctx.strokeStyle = target.color + "70";
              ctx.lineWidth = 1.5;
            } else {
              ctx.shadowColor = "transparent";
              ctx.strokeStyle = `${target.color}20`;
              ctx.lineWidth = 0.8;
            }

            ctx.stroke();
            ctx.shadowColor = "transparent";

            // Draw moving data packets for active connections or randomly
            const shouldShowPackets =
              isActive || (distance < 200 && Math.random() > 0.7);

            if (shouldShowPackets) {
              const packetCount = Math.floor(distance / 60) + 1;

              for (let i = 0; i < packetCount; i++) {
                // Calculate packet position along the curve
                const speed = isActive ? 0.4 : 0.15;
                const progress =
                  ((time * speed) / distance + i / packetCount) % 1;
                const t = progress;

                // Quadratic bezier formula
                const packetX =
                  (1 - t) * (1 - t) * shape.x +
                  2 * (1 - t) * t * midX +
                  t * t * target.x;
                const packetY =
                  (1 - t) * (1 - t) * shape.y +
                  2 * (1 - t) * t * midY +
                  t * t * target.y;

                // Determine packet style
                const packetColor = isActive ? theme.light : target.color;
                const packetSize = isActive ? 2.5 : 1.5;

                ctx.beginPath();
                ctx.arc(packetX, packetY, packetSize, 0, Math.PI * 2);

                // Add glow to packets if active
                if (isActive) {
                  ctx.shadowColor = packetColor;
                  ctx.shadowBlur = 4;
                  ctx.fillStyle = packetColor + "90";
                } else {
                  ctx.fillStyle = packetColor + "60";
                }

                ctx.fill();
                ctx.shadowColor = "transparent";
              }
            }
          }
        });
      });
    }

    function updateShapes() {
      shapes.forEach((shape) => {
        // Update position with inertia
        shape.x += shape.speedX;
        shape.y += shape.speedY;

        // Add subtle noise to movement
        shape.speedX += (Math.random() - 0.5) * 0.005;
        shape.speedY += (Math.random() - 0.5) * 0.005;

        // Apply drag
        shape.speedX *= 0.995;
        shape.speedY *= 0.995;

        // Boundary handling
        const margin = shape.size;
        const bounceStrength = 0.5;

        if (!canvas || !ctx) return;
        if (shape.x < margin) {
          shape.speedX = Math.abs(shape.speedX) * bounceStrength;
          shape.x = margin;
        } else if (shape.x > canvas.width / dpr - margin) {
          shape.speedX = -Math.abs(shape.speedX) * bounceStrength;
          shape.x = canvas.width / dpr - margin;
        }

        if (shape.y < margin) {
          shape.speedY = Math.abs(shape.speedY) * bounceStrength;
          shape.y = margin;
        } else if (shape.y > canvas.height / dpr - margin) {
          shape.speedY = -Math.abs(shape.speedY) * bounceStrength;
          shape.y = canvas.height / dpr - margin;
        }

        // Handle active state
        if (shape.active) {
          shape.activeTime++;

          // Deactivate after a while
          if (shape.activeTime > 120) {
            shape.active = false;
            shape.activeTime = 0;
          }
        }
      });

      // Periodically activate new shapes for visual interest
      if (time % activationInterval === 0) {
        // Deactivate all shapes
        shapes.forEach((s) => (s.active = false));

        // Choose a new shape to activate
        const newFocusIndex = Math.floor(Math.random() * shapes.length);
        shapes[newFocusIndex].active = true;
        shapes[newFocusIndex].activeTime = 0;

        // Also activate some connected shapes
        const connectedShapes = shapes[newFocusIndex].connections;
        connectedShapes.forEach((idx) => {
          shapes[idx].active = true;
          shapes[idx].activeTime = 0;
        });

        focusIndex = newFocusIndex;
      }
    }

    function animate() {
      time++;
      if (!canvas || !ctx) return;
      ctx.fillStyle = theme.background + "20";
      ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      // Add subtle background gradient
      const bgGradient = ctx.createRadialGradient(
        canvas.width / (2 * dpr),
        canvas.height / (2 * dpr),
        0,
        canvas.width / (2 * dpr),
        canvas.height / (2 * dpr),
        canvas.width / (2 * dpr)
      );

      bgGradient.addColorStop(0, theme.background + "08");
      bgGradient.addColorStop(1, theme.dark + "05");

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      // Update shape positions
      updateShapes();

      // Draw connections first (beneath nodes)
      drawConnections();

      // Then draw nodes on top
      shapes.forEach((shape) => drawShape(shape));

      // Floating particles in background for modern SaaS feel
      const particleCount = 50;
      for (let i = 0; i < particleCount; i++) {
        const particleSize = 1 + Math.random();
        const x = (time * 0.1 + i * 200) % (canvas.width / dpr);
        const y = (time * 0.05 + i * 100) % (canvas.height / dpr);
        const opacity = Math.sin(time * 0.01 + i) * 0.4 + 0.6;

        ctx.beginPath();
        ctx.arc(x, y, particleSize, 0, Math.PI * 2);
        ctx.fillStyle =
          theme.light +
          Math.floor(opacity * 20)
            .toString(16)
            .padStart(2, "0");
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    animate();

    // Setup event listeners
    const handleResize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 w-full h-full pointer-events-none opacity-60"
    />
  );
}
