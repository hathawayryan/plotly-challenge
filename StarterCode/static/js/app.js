// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument

var dropDown = d3.select("#selDataset");

d3.json("samples.json").then((sampleData) => {
    
    var names = sampleData.names.map(patient => patient);
    first_ID = names[0];

    names.forEach(function(person) {
        // makes new row in table
        var dropDownOption = dropDown.append("option");

        dropDownOption.attr("value", person)
        .text(person);
      });
});




function optionChanged(name){
    d3.json("samples.json").then((sampleData) => {

        var panelBody = d3.select(".panel-body");

        Object.entries(sampleData.metadata).forEach(function([key, value]) {
            if (value.id == name){
                panelBody.html("ID: " + value.id +
                "<br>Ethnicity: " + value.ethnicity+
                "<br>Gender: " + value.gender+
                "<br>Age: " + value.age+
                "<br>Location: " + value.location+
                "<br>BBtype: " + value.bbtype+
                "<br>WFreq: " + value.wfreq);
            };
        });
        var individualData = Object.fromEntries(Object.entries(sampleData.samples).filter(([k,v]) => v.id==name));


        individualData = Object.values(individualData);




        var otu_ids = individualData.map(data => data.otu_ids);
        otu_ids = otu_ids[0];

        var sample_values = individualData.map(data => data.sample_values);
        sample_values = sample_values[0];

        var otu_labels = individualData.map(data => data.otu_labels);
        otu_labels = otu_labels[0];

        var otu_sample = {};
        otu_ids.forEach((key, i) => otu_sample[key] = sample_values[i]);    

        // Create items array
        var otu_sample_array = Object.keys(otu_sample).map(function(key) {
          return [key, otu_sample[key]];
        });

        // Sort the array based on the second element
        otu_sample_array.sort(function(first, second) {
          return second[1] - first[1];
        });

        // Create a new array with only the first 5 items
        otu_sample_array = otu_sample_array.slice(0, 10);

        var top_10_otu = [];
        var top_10_sample_values = [];
        otu_sample_array.forEach(function(otu){
          top_10_otu.push("OTU " + otu[0]);
          top_10_sample_values.push(otu[1]);
        });

        top_10_otu.reverse();
        top_10_sample_values.reverse();

        var trace1 = {
          x: top_10_sample_values,
          y: top_10_otu,
          type: "bar",
          orientation: 'h'
        };

        // Create the data array for the plot
        var data = [trace1];

        // Define the plot layout
        var layout = {
          title: "Top 10 OTUs"
        };

        // Plot the chart to a div tag with id "bar-plot"
        Plotly.newPlot("bar", data, layout);


        var trace2 = {
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            text: otu_labels,
            marker: {
              size: sample_values,
              colorscale: 'YlGnBu',
              color: otu_ids,
              opacity: 1
            }
          };
          
          var data = [trace2];
          
          var layout = {
            showlegend: false,
            height: 700,
            width: 1200,
            title: "OTU Bubble Chart"
          };
          
          Plotly.newPlot('bubble', data, layout);



    });
};

optionChanged(940);