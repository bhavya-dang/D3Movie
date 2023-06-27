import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

function ChartModal({ movie, similarIMDB, theme }) {
  const chartRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState("boxOffice");
  //   const [heading, setHeading] = useState("Box Office");

  const generateChart = () => {
    // Clear any previous chart
    d3.select(chartRef.current).selectAll("*").remove();

    // Filter out entries with invalid values based on the selected option
    const filteredData = similarIMDB.filter((d) => {
      if (selectedOption === "boxOffice") {
        if (
          typeof d.BoxOffice === "string" &&
          !isNaN(parseBoxOffice(d.BoxOffice))
        ) {
          return true;
        } else if (d.BoxOffice === "N/A") {
          d.BoxOffice = 0;
          return true;
        }
      } else if (selectedOption === "metascore") {
        return typeof d.Metascore === "string" && !isNaN(d.Metascore);
      } else if (selectedOption === "imdbRating") {
        return typeof d.imdbRating === "string" && !isNaN(d.imdbRating);
      }
      return false;
    });

    // Combine the selected movie with the filtered similar movies
    const data = [...filteredData, movie];

    // Set dimensions for the chart
    const width = 740;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 50, left: 40 };

    // Calculate data range based on the selected option
    let maxDataValue;
    if (selectedOption === "boxOffice") {
      maxDataValue = d3.max(data, (d) => parseBoxOffice(d.BoxOffice));
    } else if (selectedOption === "metascore") {
      maxDataValue = d3.max(data, (d) => parseInt(d.Metascore));
    } else if (selectedOption === "imdbRating") {
      maxDataValue = d3.max(data, (d) => parseFloat(d.imdbRating));
    }

    // Create scales for x and y axes
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.Title))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const yScale = d3
      .scaleLinear()
      .domain([0, maxDataValue])
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
      .on("mouseover", function (d, i) {
        // Show tooltip on mouseover
        let xPos =
          parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
        let yPos = parseFloat(d3.select(this).attr("y")) / 2 + height / 1.5;

        d3.select("#tooltip")
          .style("left", xPos + "px")
          .style("top", yPos + "px")
          .select("#value")
          .text(getTooltipContent(i));

        d3.select("#tooltip").classed("hidden", false);

        // Highlight the bar on hover
        d3.select(this).style("opacity", 0.5);
      })
      .on("mouseout", function () {
        // Hide tooltip and restore bar opacity on mouseout
        d3.select("#tooltip").classed("hidden", true);

        d3.select(this).style("opacity", 1);
      })
      .attr("x", (d) => xScale(d.Title))
      .attr("y", (d) => {
        if (selectedOption === "boxOffice") {
          return yScale(parseBoxOffice(d.BoxOffice));
        } else if (selectedOption === "metascore") {
          return yScale(parseInt(d.Metascore));
        } else if (selectedOption === "imdbRating") {
          return yScale(parseFloat(d.imdbRating));
        }
      })
      .attr("width", xScale.bandwidth());

    svg
      .selectAll("rect")
      .transition()
      .ease(d3.easeLinear)
      .delay((d, i) => i * 50)
      .duration(500)
      .attr("height", (d) => {
        if (selectedOption === "boxOffice") {
          return yScale(0) - yScale(parseBoxOffice(d.BoxOffice));
        } else if (selectedOption === "metascore") {
          return yScale(0) - yScale(parseInt(d.Metascore));
        } else if (selectedOption === "imdbRating") {
          return yScale(0) - yScale(parseFloat(d.imdbRating));
        }
      })
      .style("fill", (d) => (d === movie ? "#d97a0d" : "#cecece"));
    // .attr("title", (d) => getTooltipContent(d));

    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .call(wrap, xScale.bandwidth());

    function wrap(text, width) {
      text.each(function () {
        let text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text
            .text(null)
            .append("tspan")
            .attr("x", 0)
            .attr("y", y)
            .attr("dy", dy + "em");
        while ((word = words.pop())) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text
              .append("tspan")
              .attr("x", 0)
              .attr("y", y)
              .attr("dy", ++lineNumber * lineHeight + dy + "em")
              .text(word);
          }
        }
      });
    }

    // Create y-axis
    const yAxis = d3.axisLeft(yScale).tickFormat((d) => {
      if (selectedOption === "boxOffice") {
        return "$" + d3.format(".2s")(d);
      } else if (selectedOption === "metascore") {
        return d;
      } else if (selectedOption === "imdbRating") {
        return d;
      }
    });

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis)
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", -35)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end");
  };

  useEffect(() => {
    if (similarIMDB && movie) {
      generateChart();
    }
  }, [selectedOption]);

  const parseBoxOffice = (value) => {
    // Remove commas and dollar sign, then parse as a number
    if (value === "N/A") {
      return 0;
    } else {
      // Remove commas and dollar sign, then parse as a number
      return parseInt(value.replace(/[$,]/g, ""));
    }
  };

  const handleSelect = (e) => {
    setSelectedOption(e.target.value);
    // const selectedOption = e.target.value;

    // // Change the heading based on the selected option
    // if (selectedOption === "boxOffice") {
    //   setHeading("Box Office Revenue");
    // } else if (selectedOption === "metascore") {
    //   setHeading("Metascore");
    // } else if (selectedOption === "imdbRating") {
    //   setHeading("IMDb Rating");
    // }
  };

  const getTooltipContent = (current) => {
    if (selectedOption === "boxOffice") {
      return current.BoxOffice;
    } else if (selectedOption === "metascore") {
      return current.Metascore;
    } else if (selectedOption === "imdbRating") {
      return current.imdbRating;
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
        <div className="modal-box w-11/12 max-w-3xl">
          {/* {theme === "halloween" ? (
            <h3 className="text-lg font-bold">{heading}</h3>
          ) : (
            <h3 className="text-lg font-bold">{heading}</h3>
          )} */}

          <select
            value={selectedOption}
            onChange={(e) => handleSelect(e)}
            className="select-primary select my-2 w-full max-w-xs"
          >
            <option value="boxOffice">Box Office Revenue</option>
            <option value="metascore">Metascore</option>
            <option value="imdbRating">IMDb Rating</option>
          </select>

          <div className="svg h-full w-full py-4" ref={chartRef}></div>
          {theme === "halloween" ? (
            <div
              id="tooltip"
              className="max-w-24 pointer-events-none absolute hidden h-auto bg-white p-1 opacity-90 shadow-md"
            >
              <p
                id="value"
                className="font-regular m-0 font-inter text-sm leading-5 text-black-gray"
              ></p>
            </div>
          ) : (
            <div
              id="tooltip"
              className="max-w-24 pointer-events-none absolute hidden h-auto bg-black-gray p-1 opacity-90 shadow-md"
            >
              <p
                id="value"
                className="font-regular m-0 font-inter text-sm leading-5 text-[#cecece]"
              ></p>
            </div>
          )}
        </div>
        <label className="modal-backdrop" htmlFor="my_modal_7">
          Close
        </label>
      </div>
    </>
  );
}

export default ChartModal;
