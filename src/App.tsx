import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Form } from "./Form";

const queryClient = new QueryClient();

export function App() {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <Form />
      </QueryClientProvider>
    </ChakraProvider>
  );
}
