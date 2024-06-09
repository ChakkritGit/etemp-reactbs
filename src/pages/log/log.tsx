import { LogSpan } from "../../style/components/log.update";

export default function Log() {
  return (
    <div className="p-2">
      <h2>Update Logs</h2>
      <LogSpan className="mt-3 mw-50"><b>Version 1.0-J8</b> <span>08/06/67</span></LogSpan>
      <ul className="mt-2">
        <li>Fixed an issue with box activity counting.</li>
        <li>Supported responsive mobile resolution.</li>
      </ul>
      <LogSpan className="mt-3"><b>Version 1.0-J7</b> <span>07/06/67</span></LogSpan>
      <ul className="mt-2">
        <li>Fixed an issue with data duplication in charts.</li>
      </ul>
      <LogSpan className="mt-3"><b>Version 1.0-J6</b> <span>06/06/67</span></LogSpan>
      <ul className="mt-2">
        <li>Bug fixes.</li>
        <li>Performance enhancement.</li>
      </ul>
    </div>
  )
}
