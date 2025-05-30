import React from "react";
import Events from "./Events";
import AllEvents from "./AllEvents";

const EventPageLayout: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      <Events />
      <AllEvents />
    </div>
  );
};

export default EventPageLayout;
