import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { UnitType } from "@prisma/client";

interface UnitTypesPopoverProps {
  unitTypes: UnitType[];
}

const UnitTypesPopover: React.FC<UnitTypesPopoverProps> = ({ unitTypes }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="link">
          {unitTypes.length} Unit{unitTypes.length !== 1 ? "s" : ""}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-4">
        <h3 className="mb-2 text-lg font-semibold">Unit Types</h3>
        <ul>
          {unitTypes.map((unitType) => (
            <li key={unitType.id} className="mb-2">
              <div className="font-medium">{unitType.name}</div>
              <div className="text-sm text-gray-600">
                Default Length: {unitType.defaultLength}
              </div>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default UnitTypesPopover;
