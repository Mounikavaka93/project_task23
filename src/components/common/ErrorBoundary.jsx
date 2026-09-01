import { Component } from 'react'
import Button from '../ui/Button'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    /* render fallback */
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="mx-auto max-w-lg px-5 py-28 text-center">
          <p className="text-[10px] tracking-[0.28em] text-accent uppercase">Atelier note</p>
          <h1 className="mt-3 font-display text-4xl italic">Something came loose.</h1>
          <p className="mt-3 text-sm text-subtle">
            A piece of the page failed to load. Return home and try again.
          </p>
          <Button to="/" className="mt-8" onClick={() => this.setState({ failed: false })}>
            Return home
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
