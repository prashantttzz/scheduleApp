import { QueryClient, QueryClientProvider  } from "@tanstack/react-query";
import WeeklyCalendar  from "./Home";
import { Toaster } from "sonner";
function App() {
  const Queryclient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={Queryclient}>
        <WeeklyCalendar/>
        <Toaster/>
      </QueryClientProvider>
    </>
  );
}

export default App;
