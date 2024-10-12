# Revik
Reactive JS Library

** experimental, wip **

## Usage
```javascript
import { rvar } from "revik";

export function App() {
    const n = rvar(0);
    setInterval(() => n.set(n.value + 1), 1000);

    return <div>{n}</div>;
}
document.body.append(<App />);
```