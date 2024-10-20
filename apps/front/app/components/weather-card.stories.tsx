import type { Meta, StoryObj } from "@storybook/react";
import { WeatherCard } from "./weather-card";
import { Cities } from "@skywatch/city-list";
import expected from "../../test/example.expected.json";

const meta = {
  component: WeatherCard,
  decorators: (Story) => (
    <div className="w-[480px]">
      <Story />
    </div>
  ),
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    city: Cities.amsterdam,
    data: expected as any,
  },
};

export const WithDomain: Story = {
  args: {
    city: Cities.tokyo,
    data: expected as any,
    domainY: {
      temperature: [0, 40],
      relativeHumidity: [0, 100],
      windSpeed: [0, 10],
    },
  },
};
