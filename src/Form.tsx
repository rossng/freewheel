import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  VStack,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { atom, useAtom } from "jotai";
import { ScrollOptions, interpolationMethods, isInterpolationMethod, scrollPage } from "./scroll";

const optionsAtom = atom<ScrollOptions>({
  pixels: 500,
  duration: 2000,
  easing: "linear",
  delay: 0,
});

const icon = new URL("images/icon-96.png", import.meta.url);

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
    <Flex direction="row">
      <VStack alignItems="center" justifyContent="center" padding={2}>
        <Image src={icon.toString()} alt="Freewheel icon" maxHeight="1rem" />
        <Heading
          as="h1"
          size="sm"
          fontWeight="normal"
          style={{
            textOrientation: "upright",
            writingMode: "vertical-lr",
          }}
        >
          Freewheel
        </Heading>
      </VStack>
      <VStack padding={2} backgroundColor="teal.50">
        <FormControl>
          <FormLabel>Distance (pixels)</FormLabel>
          <NumberInput
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
        <FormControl>
          <FormLabel>Easing</FormLabel>
          <Select
            placeholder="Select option"
            value={options.easing}
            onChange={(ev) => {
              const value = ev.target.value;
              if (isInterpolationMethod(value)) {
                setOptions((options) => ({ ...options, easing: value }));
              }
            }}
          >
            {interpolationMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Delay (ms)</FormLabel>
          <NumberInput
            step={500}
            min={0}
            value={options.delay}
            onChange={(_, value) =>
              !isNaN(value) && setOptions((options) => ({ ...options, delay: value }))
            }
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <Button onClick={() => scrollMutation.mutate()} colorScheme="teal">
          Scroll!
        </Button>
      </VStack>
    </Flex>
  );
}
