import { useRef, useEffect } from "react";
import * as d3 from "d3";

function ChartModal({ movie, similarIMDB, theme }) {
  const chartRef = useRef(null);

  const generateChart = () => {
    // Clear any previous chart
    d3.select(chartRef.current).selectAll("*").remove();

    // Filter out entries with invalid BoxOffice values
    // const filteredData = similarIMDB.filter(
    //   (d) =>
    //     typeof d.BoxOffice === "string" && !isNaN(parseBoxOffice(d.BoxOffice))
    // );

    const filteredData = similarIMDB.filter((d) => {
      if (
        typeof d.BoxOffice === "string" &&
        !isNaN(parseBoxOffice(d.BoxOffice))
      ) {
        return true;
      } else if (d.BoxOffice === "N/A") {
        d.BoxOffice = 0;
        return true;
      }
      return false;
    });

    // Combine the selected movie with the filtered similar movies
    const data = [...filteredData, movie];
    console.log("total data: ", data);

    // Set dimensions for the chart
    const width = 480;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    // Calculate data range
    const maxBoxOffice = d3.max(data, (d) => parseBoxOffice(d.BoxOffice));

    // Create scales for x and y axes
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.Title))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, maxBoxOffice])
      .range([height - margin.bottom, margin.top]);

    // Create SVG container
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Create bars
    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .on("mouseover", function () {
        // Highlight the bar on hover
        d3.select(this).style("opacity", 0.5);
      })
      .on("mouseout", function () {
        d3.select(this).style("opacity", 1);
      })
      .attr("x", (d) => xScale(d.Title))
      .attr("y", (d) => yScale(parseBoxOffice(d.BoxOffice)))
      .attr("width", xScale.bandwidth());

    svg
      .selectAll("rect")
      .transition()
      .ease(d3.easeLinear)
      .delay((d, i) => i * 50)
      .duration(500)
      .attr("height", (d) => yScale(0) - yScale(parseBoxOffice(d.BoxOffice)))
      .style("fill", (d) => (d === movie ? "#d97a0d" : "gray"));

    const xAxis = d3.axisBottom(xScale);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    // Create y-axis
    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat((d) => `$${d3.format(".2s")(d)}`); // Format y-axis tick labels with dollar sign
    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis);
  };

  useEffect(() => {
    if (similarIMDB && movie) {
      generateChart();
    }
  }, []);

  const parseBoxOffice = (value) => {
    // Remove commas and dollar sign, then parse as a number
    if (value === "N/A") {
      return 0;
    } else {
      // Remove commas and dollar sign, then parse as a number
      return parseInt(value.replace(/[$,]/g, ""));
    }
  };

  return (
    <>
      <label
        htmlFor="my_modal_7"
        onClick={() => {
          similarIMDB && movie && generateChart();
        }}
        className="glass btn absolute bottom-[5%] right-[2%] bg-halloween-orange
        font-inter normal-case text-white hover:bg-gray-800 hover:text-white"
      >
        Compare All
      </label>

      <input type="checkbox" id="my_modal_7" className="modal-toggle" />
      <div className="modal font-inter">
        <div className="modal-box z-50">
          {theme === "halloween" ? (
            <h3 className="text-lg font-bold">Box Office Revenue</h3>
          ) : (
            <h3 className="text-lg font-bold">Box Office Revenue</h3>
          )}
          <div className="svg h-full w-full py-4" ref={chartRef}></div>
        </div>
        <label className="modal-backdrop" htmlFor="my_modal_7">
          Close
        </label>
      </div>
    </>
  );
}

export default ChartModal;
