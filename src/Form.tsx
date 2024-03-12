import {
  Button,
  ChakraProvider,
  FormControl,
  FormHelperText,
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
import { scrollPage } from "./scroll";

const pixelsAtom = atom(500);

export function Form() {
  const [pixels, setPixels] = useAtom(pixelsAtom);

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
      return browser.scripting.executeScript({
        target: {
          tabId: tab[0].id,
        },
        func: scrollPage as any,
        args: [pixels],
      });
    },
  });

  return (
    <ChakraProvider>
      <VStack padding={2}>
        <Heading as="h1">Freewheel</Heading>
        <FormControl>
          <FormLabel>Pixels</FormLabel>
          <NumberInput
            defaultValue={15}
            min={10}
            max={20}
            value={pixels}
            onChange={(_, px) => setPixels(px)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormHelperText>Number of pixels to scroll.</FormHelperText>
        </FormControl>
        <Button onClick={() => scrollMutation.mutate()}>Scroll!</Button>
      </VStack>
    </ChakraProvider>
  );
}
