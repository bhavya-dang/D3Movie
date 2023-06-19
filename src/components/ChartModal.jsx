import { useRef } from "react";
import * as d3 from "d3";

function ChartModal({ movie, similarIMDB, theme }) {
  const chartRef = useRef(null);

  // useEffect(() => {
  const generateChart = () => {
    // Clear any previous chart
    d3.select(chartRef.current).selectAll("*").remove();

    // Filter out entries with invalid BoxOffice values
    const filteredData = similarIMDB.filter(
      (d) =>
        typeof d.BoxOffice === "string" && !isNaN(parseBoxOffice(d.BoxOffice))
    );

    // Combine the selected movie with the filtered similar movies
    const data = [...filteredData, movie];

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

    // // Create the tooltip
    // const tip = d3Tip()
    //   .attr("class", "d3-tip")
    //   .html((d) => {
    //     if (d.BoxOffice) {
    //       return d.BoxOffice;
    //     } else {
    //       return "Box Office: N/A";
    //     }
    //   });

    // // Call the tooltip
    // svg.call(tip);

    // Create bars
    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .on("mouseover", function (event) {
        d3.select(event.target).style("opacity", 0.5);
      })
      .on("mouseout", function (event) {
        d3.select(event.target).style("opacity", 1);
      })
      .attr("x", (d) => xScale(d.Title))
      .attr("y", (d) => yScale(parseBoxOffice(d.BoxOffice)))
      .attr("width", xScale.bandwidth())
      .transition()
      .ease(d3.easeLinear)
      .delay((d, i) => i * 50)
      .duration(500)
      .attr("height", (d) => yScale(0) - yScale(parseBoxOffice(d.BoxOffice)))
      .style("fill", (d) => (d === movie ? "#d97a0d" : "gray"));

    // bars
    //
    // bars
    //   .transition()
    //   .ease(d3.easeLinear)
    //   .delay((d, i) => i * 50)
    //   .duration(500);

    // Create x-axis
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

  // generateChart();
  // }, [similarIMDB, movie]);

  const parseBoxOffice = (value) => {
    // Remove commas and dollar sign, then parse as a number
    return parseInt(value.replace(/[$,]/g, ""));
  };

  return (
    <>
      {/* The button to open modal */}
      <label
        htmlFor="my_modal_7"
        onClick={generateChart}
        className="btn bg-halloween-orange text-white hover:text-white font-inter glass
        hover:bg-gray-800 normal-case absolute bottom-[5%] right-[2%]"
      >
        Compare All
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my_modal_7" className="modal-toggle" />
      <div className="modal font-inter">
        <div className="modal-box z-50">
          {theme === "halloween" ? (
            <h3 className="text-lg font-bold">Box Office Revenue</h3>
          ) : (
            <h3 className="text-lg text-gray-100 font-bold">
              Box Office Revenue
            </h3>
          )}
          <div className="py-4 svg w-full h-full" ref={chartRef}></div>
        </div>
        <label className="modal-backdrop" htmlFor="my_modal_7">
          Close
        </label>
      </div>
    </>
  );
}

export default ChartModal;
