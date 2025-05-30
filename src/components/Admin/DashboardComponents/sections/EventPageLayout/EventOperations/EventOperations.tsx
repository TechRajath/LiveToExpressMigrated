import SingleEvent from "./SingleEvent";
import CustomerData from "../../customer";
const EventOperations = ({ eventId }: { eventId: string }) => {
  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-8">
          <SingleEvent eventId={eventId} />
          <CustomerData eventId={eventId} />
        </div>
      </div>
    </div>
  );
};
export default EventOperations;
