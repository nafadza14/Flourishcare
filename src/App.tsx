/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./Layout";
import { Homepage } from "./pages/Homepage";
import { Booking } from "./pages/Booking";
import { Pricing } from "./pages/Pricing";
import { Services } from "./pages/Services";
import { Team } from "./pages/Team";
import { About } from "./pages/About";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="booking" element={<Booking />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="services" element={<Services />} />
          <Route path="team" element={<Team />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
