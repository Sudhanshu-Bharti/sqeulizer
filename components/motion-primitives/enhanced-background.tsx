"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  connections: number[];
  pulsePhase: number;
  type: "table" | "relation";
}

export function EnhancedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let nodes: Node[] = [];
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };

    const initNodes = () => {
      nodes = [];
      const numberOfNodes = Math.floor((canvas.width * canvas.height) / 40000); // Adjust node density

      for (let i = 0; i < numberOfNodes; i++) {
        const node: Node = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 2,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
          connections: [],
          pulsePhase: Math.random() * Math.PI * 2,
          type: Math.random() > 0.7 ? "table" : "relation",
        };

        // Create connections between nodes
        for (let j = 0; j < nodes.length; j++) {
          if (Math.random() > 0.85) {
            node.connections.push(j);
            nodes[j].connections.push(nodes.length);
          }
        }

        nodes.push(node);
      }
    };

    const drawNode = (node: Node, index: number) => {
      const pulse = Math.sin(time * 0.002 + node.pulsePhase) * 0.5 + 0.5;

      if (node.type === "table") {
        // Draw table node (rectangle)
        ctx.beginPath();
        const size = node.size * 2;
        ctx.rect(node.x - size / 2, node.y - size / 2, size, size);
        ctx.fillStyle = `rgba(56, 189, 248, ${0.1 + pulse * 0.1})`; // sky-400
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.05 + pulse * 0.05})`;
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        // Draw inner rectangle for table effect
        ctx.beginPath();
        ctx.rect(
          node.x - size / 3,
          node.y - size / 3,
          (size * 2) / 3,
          (size * 2) / 3
        );
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.03 + pulse * 0.03})`;
        ctx.stroke();
      } else {
        // Draw relation node (circle)
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244, 114, 182, ${0.1 + pulse * 0.1})`; // pink-400
        ctx.fill();
      }

      // Draw connections
      node.connections.forEach((targetIndex) => {
        const target = nodes[targetIndex];
        if (!target) return;

        const dx = target.x - node.x;
        const dy = target.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < canvas.width * 0.3) {
          // Only draw connections within range
          const progress = (time * 0.02) % distance;
          const movingPoint = {
            x: node.x + (dx * progress) / distance,
            y: node.y + (dy * progress) / distance,
          };

          // Draw connection line
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${
            0.02 * (1 - distance / (canvas.width * 0.3))
          })`; // purple-500
          ctx.lineWidth = 1;
          ctx.stroke();

          // Draw moving dot along the connection
          ctx.beginPath();
          ctx.arc(movingPoint.x, movingPoint.y, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(168, 85, 247, ${
            0.1 * (1 - distance / (canvas.width * 0.3))
          })`; // purple-500
          ctx.fill();
        }
      });
    };

    const animate = () => {
      time++;

      // Clear with slight trail effect
      ctx.fillStyle = "rgba(2, 6, 23, 0.05)"; // slate-950
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodes.forEach((node, index) => {
        // Update position
        node.x += node.speedX;
        node.y += node.speedY;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.speedX *= -1;
        if (node.y < 0 || node.y > canvas.height) node.speedY *= -1;

        // Keep within bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));

        drawNode(node, index);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-50"
    />
  );
}
