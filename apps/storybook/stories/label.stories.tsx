import { Label } from "@platform/design-system/components/ui/label";
import type { Meta, StoryObj } from "@storybook/react";

/**
 * Renders an accessible label associated with controls.
 */
const meta: Meta<typeof Label> = {
  title: "ui/Label",
  component: Label,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: { type: "text" },
    },
  },
  args: {
    children: "Your email address",
    htmlFor: "email",
  },
};

export default meta;

type Story = StoryObj<typeof Label>;

/**
 * The default form of the label.
 */
export const Default: Story = {};
