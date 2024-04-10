import { React, type AllWidgetProps } from "jimu-core";
import { type IMConfig } from "../config";
import TestForm from "./components/form/TestForm";
import Count from "./components/counts/Count";
// const Widget = (props: AllWidgetProps<IMConfig>) => {
//   return (
//     <>
//       <div className="widget-demo jimu-widget m-2">
//         <p>Simple Widget</p>
//         <p>exampleConfigProperty: {props.config.exampleConfigProperty}</p>
//         <Button variant="contained">Contained</Button>
//         <Button variant="outlined">Outlined</Button>
//         <Test />
//       </div>
//     </>
//   );
// };

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig> & { a: string }, unknown> {
  /**
   * Map the state your widget needs
   * @param state
   */

  render() {
    return (
      <div className="widget-demo jimu-widget m-2">
        <p>exampleConfigProperty: {this.props.config.exampleConfigProperty}</p>
        <h4>Controller and styled by REDUX - REACT-HOOKFORM - MUI</h4>
        <TestForm {...this.props} />
      </div>
    );
  }
}
