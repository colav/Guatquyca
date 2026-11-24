"use client";

import { Component } from "react";
import { Button, Result } from "antd";

/**
 * F126 (D-268): error boundary of the map. If the map fails, it shows the message of the board with «Reintentar» (the same words
 * as the other panels) instead of leaving the exception loose. The error is not swallowed: it goes once to `console.error`.
 */
export default class MapErrorBoundary extends Component {
  state = { error: null, attempt: 0 };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    // Once per failure (a retry that fails again is a new failure).
    console.error("[MapChart] the map could not be drawn:", error);
  }

  retry = () => this.setState((s) => ({ error: null, attempt: s.attempt + 1 }));

  render() {
    if (this.state.error) {
      return (
        <div data-testid="map-error" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
          <Result
            status="warning"
            title="No se pudo dibujar el mapa."
            extra={<Button type="primary" onClick={this.retry}>Reintentar</Button>}
          />
        </div>
      );
    }
    // The key changes with each retry, so the map is built again from zero.
    return <div key={this.state.attempt} style={{ height: "100%", width: "100%" }}>{this.props.children}</div>;
  }
}
