import EventOperations from "@/components/Admin/DashboardComponents/sections/EventPageLayout/EventOperations/EventOperations";

import { FC } from "react";

interface EventPageProps {
  params: { eventId: string };
}

const EventPage: FC<EventPageProps> = ({ params }) => {
  return <EventOperations eventId={params.eventId} />;
};

export default EventPage;
