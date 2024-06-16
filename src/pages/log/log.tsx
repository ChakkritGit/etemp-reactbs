import { LogSpan } from "../../style/components/log.update";

export default function Log() {
  return (
    <div className="p-2">
      <h2>Change Log</h2>
      <LogSpan className="mt-3 mw-50"><b>Version 1.0-J16</b> <span>16/06/67</span></LogSpan>
      <ul className="mt-2">
        <li>Added responsive bottom navigation.</li>
        <li>Added more language china and japan.</li>
      </ul>
      <LogSpan className="mt-3 mw-50"><b>Version 1.0-J14</b> <span>14/06/67</span></LogSpan>
      <ul className="mt-2">
        <li>Fixed image layout object-fit contain and cover.</li>
        <li>Fixed service worker cache memory (PWA).</li>
        <li>Added translation coverage.</li>
        <li>Added notification sound setting.</li>
      </ul>
      <LogSpan className="mt-3 mw-50"><b>Version 1.0-J13</b> <span>13/06/67</span></LogSpan>
      <ul className="mt-2">
        <li>Added filtering of the list of problematic devices throughout the day when clicking on a card.</li>
        <li>Added notification read choice in notification modal.</li>
        <li>Added a shortcut when clicking a card to navigate to the [adjust, warranties, repair] page.</li>
        <li>Added a hostory page.</li>
        <li>Fixed an issue door opening error.</li>
        <li>Fixed an issue language translator.</li>
        <li>Optimized PWA, when offline the website can still be used.</li>
      </ul>
      <LogSpan className="mt-3 mw-50"><b>Version 1.0-J10</b> <span>10/06/67</span></LogSpan>
      <ul className="mt-2">
        <li>Added a notification that floats to the bottom right corner.</li>
      </ul>
      <LogSpan className="mt-3 mw-50"><b>Version 1.0-J8</b> <span>08/06/67</span></LogSpan>
      <ul className="mt-2">
        <li>Fixed an issue with box activity counting.</li>
        <li>Optimized support responsive mobile resolution.</li>
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
