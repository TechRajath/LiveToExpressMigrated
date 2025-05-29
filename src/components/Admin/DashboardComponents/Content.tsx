import Home from "./sections/Home";
import ArtInMotion from "./sections/ArtInMotion";
import CreativeCorner from "./sections/CreativeCorner";
import Location from "./sections/Location";
import LandingPage from "./sections/LandingPage";
import Events from "./sections/Events";

export default function Content({ section }: { section: string }) {
  switch (section) {
    case "Landing Page":
      return <LandingPage />;
    case "Art in Motion":
      return <ArtInMotion />;
    case "Creative Corner":
      return <CreativeCorner />;
    case "Location":
      return <Location />;
    case "Events":
      return <Events />;
    case "Home":
    default:
      return <Home />;
  }
}
