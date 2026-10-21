import React, { useState } from "react";
import { 
  Button, 
  InputGroup, 
  Card, 
  Elevation, 
  ButtonGroup, 
  Divider, 
  Label,
  NumericInput
} from "@blueprintjs/core";
import "./Visualizer.css";

interface ArrayItem {
  id: string;
  value: number | string;
}

export const ArrayVisualizer: React.FC = () => {
  const [array, setArray] = useState<ArrayItem[]>([
    { id: "1", value: 12 },
    { id: "2", value: 45 },
    { id: "3", value: 7 },
    { id: "4", value: 89 },
    { id: "5", value: 23 },
  ]);

  const [inputValue, setInputValue] = useState<string>("");
  const [targetIndex, setTargetIndex] = useState<number>(0);

  const handlePush = () => {
    if (inputValue.trim() === "") return;
    const newItem: ArrayItem = {
      id: Math.random().toString(36).substr(2, 9),
      value: isNaN(Number(inputValue)) ? inputValue : Number(inputValue),
    };
    setArray([...array, newItem]);
    setInputValue("");
  };

  const handlePop = () => {
    if (array.length === 0) return;
    setArray(array.slice(0, -1));
  };

  const handleUpdateAt = () => {
    if (inputValue.trim() === "" || targetIndex < 0 || targetIndex >= array.length) return;
    
    const updatedArray = [...array];
    updatedArray[targetIndex] = {
      ...updatedArray[targetIndex],
      value: isNaN(Number(inputValue)) ? inputValue : Number(inputValue),
    };
    setArray(updatedArray);
    setInputValue("");
  };

  const handleClear = () => {
    setArray([]);
  };

  return (
    <div className="visualizer-container">
      <Card elevation={Elevation.TWO} className="visualizer-card">
        <h3 className="bp5-heading">Contiguous Array Visualizer</h3>
        <p className="bp5-text-muted">A horizontal layout of contiguous blocks with index positions below.</p>
        
        <Divider />

        {/* Horizontal Array Wrapper */}
        <div className="array-track-wrapper">
          {array.length === 0 ? (
            <div className="empty-state-message bp5-text-muted">
              Array is empty. Add elements below to populate it.
            </div>
          ) : (
            <div className="array-track">
              {array.map((item, index) => (
                <div key={item.id} className="array-cell-container">
                  {/* Top: Contiguous Visual Cell */}
                  <div className="array-cell">
                    <span className="cell-value">{item.value}</span>
                  </div>
                  
                  {/* Bottom: Index Indicator */}
                  <div className="cell-index bp5-text-muted">[{index}]</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Divider />

        {/* Controls Layout */}
        <div className="controls-grid">
          <div className="control-field">
            <Label>
              Element Value
              <InputGroup
                asyncControl={true}
                placeholder="e.g. 42 or 'hello'"
                value={inputValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
              />
            </Label>
          </div>

          <div className="control-field">
            <Label>
              Target Index
              <NumericInput
                min={0}
                max={Math.max(0, array.length - 1)}
                value={targetIndex}
                onValueChange={(valueAsNumber: number) => setTargetIndex(valueAsNumber)}
                disabled={array.length === 0}
              />
            </Label>
          </div>
        </div>

        <div className="actions-row">
          <ButtonGroup>
            <Button intent="primary" icon="plus" text="Push" onClick={handlePush} disabled={!inputValue.trim()} />
            <Button intent="warning" icon="minus" text="Pop" onClick={handlePop} disabled={array.length === 0} />
            <Button 
              intent="none" 
              icon="edit" 
              text="Update At Index" 
              onClick={handleUpdateAt} 
              disabled={!inputValue.trim() || array.length === 0 || targetIndex >= array.length} 
            />
          </ButtonGroup>
          
          <Button intent="danger" icon="trash" text="Clear Array" onClick={handleClear} disabled={array.length === 0} />
        </div>
      </Card>
    </div>
  );
};
