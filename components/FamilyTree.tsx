import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { FamilyMember, TreeProps } from '../types';

const FamilyTree: React.FC<TreeProps> = ({ data, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        setDimensions({
          width: wrapperRef.current.clientWidth,
          height: wrapperRef.current.clientHeight
        });
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Render D3 Tree
  useEffect(() => {
    if (!dimensions.width || !dimensions.height || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    // Setup Zoom
    const zoomGroup = svg.append("g");
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        zoomGroup.attr("transform", event.transform);
      });

    svg.call(zoom);
    // Initial position
    svg.call(zoom.transform, d3.zoomIdentity.translate(dimensions.width / 2, 80).scale(0.8));

    // Create Hierarchy
    const root = d3.hierarchy<FamilyMember>(data);
    
    // Set tree layout
    const treeLayout = d3.tree<FamilyMember>()
      .nodeSize([120, 180]); // Slightly increased vertical spacing

    treeLayout(root);

    // Links
    const links = zoomGroup.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 2)
      .attr("d", d3.linkVertical()
        .x((d: any) => d.x)
        .y((d: any) => d.y) as any
      );

    // Nodes
    const nodes = zoomGroup.selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d: any) => `translate(${d.x},${d.y})`)
      .style("cursor", "move") // Cursor indicates draggable
      .on("click", (event, d) => {
        if ((event.defaultPrevented)) return; // Don't trigger click if dragged
        onNodeClick(d.data);
      });

    // Drag Behavior
    const dragBehavior = d3.drag<SVGGElement, d3.HierarchyPointNode<FamilyMember>>()
      .on("start", function(event, d) {
        d3.select(this).raise().style("opacity", 0.7);
      })
      .on("drag", function(event, d) {
        // Update visual position directly for smooth "feel"
        d3.select(this).attr("transform", `translate(${d.x = event.x},${d.y = event.y})`);
        
        // Update links connected to this node
        links.filter(l => l.source === d || l.target === d)
             .attr("d", d3.linkVertical()
                .x((l: any) => l.x)
                .y((l: any) => l.y) as any
             );
      })
      .on("end", function(event, d) {
        d3.select(this).style("opacity", 1);
      });

    nodes.call(dragBehavior as any);

    // Node Visuals
    // Card Shadow
    nodes.append("rect")
      .attr("width", 100)
      .attr("height", 64)
      .attr("x", -50)
      .attr("y", -32)
      .attr("rx", 12)
      .attr("fill", "#000000")
      .attr("opacity", 0.1)
      .attr("transform", "translate(2, 2)");

    // Card Background
    nodes.append("rect")
      .attr("width", 100)
      .attr("height", 64)
      .attr("x", -50)
      .attr("y", -32)
      .attr("rx", 12)
      .attr("fill", "white")
      .attr("stroke", (d) => d.data.gender === 'female' ? '#f472b6' : '#60a5fa') // Pink-400 vs Blue-400
      .attr("stroke-width", 2);

    // Avatar (if photo exists) or Initials
    nodes.append("clipPath")
      .attr("id", (d) => `clip-${d.data.id}`)
      .append("circle")
      .attr("cx", 0)
      .attr("cy", -32)
      .attr("r", 20);

    nodes.append("circle")
      .attr("cx", 0)
      .attr("cy", -32)
      .attr("r", 22)
      .attr("fill", "white")
      .attr("stroke", (d) => d.data.gender === 'female' ? '#f472b6' : '#60a5fa')
      .attr("stroke-width", 2);

    nodes.append("image")
      .attr("xlink:href", (d) => d.data.photoUrl || `https://ui-avatars.com/api/?name=${d.data.name}&background=random`)
      .attr("x", -20)
      .attr("y", -52)
      .attr("width", 40)
      .attr("height", 40)
      .attr("clip-path", (d) => `url(#clip-${d.data.id})`)
      .attr("preserveAspectRatio", "xMidYMid slice");

    // Name Text
    nodes.append("text")
      .attr("dy", "5")
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .style("font-weight", "600")
      .style("fill", "#1e293b")
      .text((d) => d.data.name);

    // Date/Occupation Text
    nodes.append("text")
      .attr("dy", "20")
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("fill", "#64748b")
      .text((d) => d.data.birthDate.split('-')[0] || '未知年份');

  }, [data, dimensions, onNodeClick]);

  return (
    <div ref={wrapperRef} className="w-full h-full bg-slate-50 overflow-hidden relative cursor-grab active:cursor-grabbing">
      <svg ref={svgRef} className="w-full h-full touch-action-none" />
      <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-100 text-xs text-slate-500 pointer-events-none flex flex-col gap-2 select-none">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 flex items-center justify-center bg-slate-100 rounded">👆</span>
          <span>单击节点查看详情</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 flex items-center justify-center bg-slate-100 rounded">✋</span>
          <span>按住拖动调整布局</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 flex items-center justify-center bg-slate-100 rounded">🔍</span>
          <span>双指或鼠标滚轮缩放</span>
        </div>
      </div>
    </div>
  );
};

export default FamilyTree;