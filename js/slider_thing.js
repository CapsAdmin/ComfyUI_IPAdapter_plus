import { app } from "../../scripts/app.js";
var margin = 15;
let slider_width = 15;
let slider_spacing = slider_width - 5;
let clamp = (x, min, max) => Math.max(Math.min(x, max), min);
const getValues = (realNode) => {
  const values = realNode.options.getValue();
  try {
    return JSON.parse(values);
  } catch (err) {
    console.log("error reading ", values, " as json");
    return [];
  }
};

const setValues = (realNode, values) => {
  let new_values = JSON.stringify(values, null, 4);
  realNode.options.setValue(new_values);
};

app.registerExtension({
  name: "IPAdapterPlus-SliderThing",

  nodeCreated(node, app) {
    if (
      node.comfyClass == "IPAdapterAttentionWeights" ||
      node.comfyClass == "LoraLoaderModelOnlyBlockWeight"
    ) {
      const textNode = node.widgets[0];

      node.addCustomWidget({
        type: "slider-thing",
        name: "test",
        callback: () => {},
        disabled: false,
        options: {
          property: "values",
        },
        mouse(event, [x, y], node) {
          let widget_width = this.widget_width;
          let values = getValues(textNode);
          let curY = this.widget_y - slider_width;

          for (const key in values) {
            curY += slider_width;

            if (y < curY || y > curY + slider_width) continue;
            var new_value = clamp(
              (x - margin) / (widget_width - margin * 2),
              0,
              1
            );

            values[key] = new_value;
          }

          setValues(textNode, values);

          return true;
        },
        draw(ctx, node, widget_width, y, H) {
          this.widget_width = widget_width;
          this.widget_y = y;
          let values = getValues(textNode);
          let curY = 0;
          for (const key in values) {
            const val = values[key];

            ctx.fillStyle = LiteGraph.WIDGET_BGCOLOR;
            ctx.fillRect(
              margin,
              y + curY,
              widget_width - margin * 2,
              slider_spacing
            );

            var new_value = clamp(val, 0, 1);

            ctx.fillStyle = LiteGraph.WIDGET_TEXT_COLOR;
            ctx.fillRect(
              margin,
              y + curY,
              new_value * (widget_width - margin * 2),
              slider_spacing
            );

            ctx.textAlign = "center";
            ctx.fillStyle = LiteGraph.WIDGET_BGCOLOR;
            ctx.fillText(
              key,
              widget_width * 0.5,
              y + curY + slider_width * 0.5
            );
            curY += slider_width;
          }
        },
        computeSize() {
          return [150, Object.keys(getValues(textNode)).length * slider_width];
        },
      });

      node.addWidget(
        "combo",
        "preset",
        "test",
        (value) => {
          if (value == "sd1.5") {
            setValues(realNode, {
              input_1_0: 1,
              input_2_0: 1,
              input_4_0: 1,
              input_5_0: 1,
              input_7_0: 1,
              input_8_0: 1,
              middle_0_0: 1,
              output_3_0: 1,
              output_4_0: 1,
              output_5_0: 1,
              output_6_0: 1,
              output_7_0: 1,
              output_8_0: 1,
              output_9_0: 1,
              output_10_0: 1,
              output_11_0: 1,
            });
          } else if (value == "sdxl") {
            setValues(realNode, {
              input_4_0: 1,
              input_4_1: 1,
              input_5_0: 1,
              input_5_1: 1,
              input_7_0: 1,
              input_7_1: 1,
              input_7_2: 1,
              input_7_3: 1,
              input_7_4: 1,
              input_7_5: 1,
              input_7_6: 1,
              input_7_7: 1,
              input_7_8: 1,
              input_7_9: 1,
              input_8_0: 1,
              input_8_1: 1,
              input_8_2: 1,
              input_8_3: 1,
              input_8_4: 1,
              input_8_5: 1,
              input_8_6: 1,
              input_8_7: 1,
              input_8_8: 1,
              input_8_9: 1,
              middle_0_0: 1,
              middle_0_1: 1,
              middle_0_2: 1,
              middle_0_3: 1,
              middle_0_4: 1,
              middle_0_5: 1,
              middle_0_6: 1,
              middle_0_7: 1,
              middle_0_8: 1,
              middle_0_9: 1,
              output_0_0: 1,
              output_0_1: 1,
              output_0_2: 1,
              output_0_3: 1,
              output_0_4: 1,
              output_0_5: 1,
              output_0_6: 1,
              output_0_7: 1,
              output_0_8: 1,
              output_0_9: 1,
              output_1_0: 1,
              output_1_1: 1,
              output_1_2: 1,
              output_1_3: 1,
              output_1_4: 1,
              output_1_5: 1,
              output_1_6: 1,
              output_1_7: 1,
              output_1_8: 1,
              output_1_9: 1,
              output_2_0: 1,
              output_2_1: 1,
              output_2_2: 1,
              output_2_3: 1,
              output_2_4: 1,
              output_2_5: 1,
              output_2_6: 1,
              output_2_7: 1,
              output_2_8: 1,
              output_2_9: 1,
              output_3_0: 1,
              output_3_1: 1,
              output_4_0: 1,
              output_4_1: 1,
              output_5_0: 1,
              output_5_1: 1,
            });
          } else if (value == "convert to array") {
            let values = getValues(textNode);
            let list = [];
            for (const [key, val] of Object.entries(values)) {
              list.push(val);
            }
            setValues(textNode, list);
          }

          console.log("change!", value);
        },
        {
          values: [
            "8 values",
            "16 values",
            "32 values",
            "sd1.5",
            "sdxl",
            "convert to array",
          ],
        }
      );
    }
  },
});
