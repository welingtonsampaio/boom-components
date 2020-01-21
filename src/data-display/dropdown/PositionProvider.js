/* eslint-disable indent */
import React, { Component } from "react";
import { PositionWrapper, DropdownContent } from "./styles";

class PositionProvider extends Component {
  constructor(props) {
    super(props);
    this.element =
      typeof React.createRef === "function"
        ? React.createRef()
        : el => (this.element = { current: el });
    this.state = {
      style: {},
      arrowPosition: "bottom"
    };
  }

  componentDidMount() {
    const { origin } = this.props;
    const dispatcherRect = origin.current.getBoundingClientRect();
    const contentRect = this.element.current.getBoundingClientRect();

    const scope = typeof window === "undefined" ? global : window;
    const arrowPos =
      dispatcherRect.bottom + contentRect.height > scope.innerHeight
        ? "top"
        : "bottom";

    this.setState({
      arrowPosition: arrowPos,
      style: this.positionElement(arrowPos)
    });
  }

  horizontalPositioning = (dispatcherRect, contentRect) => {
    const { align } = this.props;
    switch (align) {
      case "right":
        return {
          left: dispatcherRect.right,
          transform: "translateX(-100%)"
        };
      case "center":
        return {
          left: dispatcherRect.left + dispatcherRect.width / 2,
          transform: "translateX(-50%)"
        };
      default:
        return {
          left: `${dispatcherRect.left}px`
        };
    }
  };

  positionElement = arrowPos => {
    const { origin } = this.props;
    const target = origin.current;
    const rect = target ? target.getBoundingClientRect() : { left: 0, top: 0 };
    const elRect = this.element.current.getBoundingClientRect();

    const top =
      arrowPos === "bottom" ? rect.bottom + 6 : rect.y - (elRect.height + 6);

    return {
      ...this.horizontalPositioning(rect, elRect),
      top
    };
  };

  render() {
    const { children, align, style: overlayStyle, className } = this.props;
    const { style, arrowPosition } = this.state;

    const positionProps = {};
    typeof React.createRef === "function"
      ? (positionProps.ref = this.element)
      : (positionProps.innerRef = this.element);
    return (
      <PositionWrapper style={style} {...positionProps}>
        <DropdownContent
          className={className}
          style={overlayStyle}
          align={align}
          arrowPos={arrowPosition}
        >
          {children}
        </DropdownContent>
      </PositionWrapper>
    );
  }
}

export default PositionProvider;