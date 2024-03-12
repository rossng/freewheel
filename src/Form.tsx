import {
  Button,
  ChakraProvider,
  FormControl,
  FormLabel,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  VStack,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { atom, useAtom } from "jotai";
import { ScrollOptions, scrollPage } from "./scroll";

const optionsAtom = atom<ScrollOptions>({
  pixels: 500,
  duration: 2000,
  easing: "linear",
});

export function Form() {
  const [options, setOptions] = useAtom(optionsAtom);

  const scrollMutation = useMutation({
    mutationKey: ["scroll"],
    mutationFn: async () => {
      const tab = await browser.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
      if (!tab.length || tab[0].id === undefined) {
        throw new Error("No tab found");
      }
      const promise = browser.scripting.executeScript({
        target: {
          tabId: tab[0].id,
        },
        func: scrollPage as any,
        args: [options],
      });

      window.close();

      await promise;
    },
  });

  return (
    <ChakraProvider>
      <VStack padding={2}>
        <Heading as="h1">Freewheel</Heading>
        <FormControl>
          <FormLabel>Distance (pixels)</FormLabel>
          <NumberInput
            defaultValue={500}
            step={100}
            value={options.pixels}
            onChange={(_, value) =>
              !isNaN(value) && setOptions((options) => ({ ...options, pixels: value }))
            }
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>Duration (ms)</FormLabel>
          <NumberInput
            defaultValue={2000}
            step={500}
            min={0}
            value={options.duration}
            onChange={(_, value) =>
              !isNaN(value) && setOptions((options) => ({ ...options, duration: value }))
            }
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <Button onClick={() => scrollMutation.mutate()}>Scroll!</Button>
      </VStack>
    </ChakraProvider>
  );
}
