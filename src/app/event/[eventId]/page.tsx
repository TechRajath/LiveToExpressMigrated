import EventPageLayout from "@/components/EventPageLayout/EventPageLayout";
import { FC } from "react";

interface EventPageProps {
  params: { eventId: string };
}

const EventPage: FC<EventPageProps> = ({ params }) => {
  return <EventPageLayout eventId={params.eventId} />;
};

export default EventPage;
