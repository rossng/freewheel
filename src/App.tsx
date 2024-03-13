import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Form } from "./Form";

const queryClient = new QueryClient();

const theme = extendTheme({});

export function App() {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Form />
      </QueryClientProvider>
    </ChakraProvider>
  );
}
