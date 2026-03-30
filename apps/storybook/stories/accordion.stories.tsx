import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@platform/design-system/components/ui/accordion";
import type { Meta, StoryObj } from "@storybook/react";

interface AccordionStoryProps {
  collapsible?: boolean;
  type: "multiple" | "single";
}

/**
 * A vertically stacked set of interactive headings that each reveal a section
 * of content.
 */
const meta: Meta<AccordionStoryProps> = {
  title: "ui/Accordion",
  component: Accordion as never,
  tags: ["autodocs"],
  argTypes: {
    type: {
      options: ["single", "multiple"],
      control: { type: "radio" },
    },
  },
  args: {
    type: "single",
    collapsible: true,
  },
  render: (args) => {
    const content = (
      <>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>
            Yes. It comes with default styles that matches the other components'
            aesthetic.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>
            Yes. It's animated by default, but you can disable it if you prefer.
          </AccordionContent>
        </AccordionItem>
      </>
    );

    if (args.type === "multiple") {
      return <Accordion type="multiple">{content}</Accordion>;
    }

    return (
      <Accordion collapsible={args.collapsible} type="single">
        {content}
      </Accordion>
    );
  },
};

export default meta;

type Story = StoryObj<AccordionStoryProps>;

/**
 * The default behavior of the accordion allows only one item to be open.
 */
export const Default: Story = {};
