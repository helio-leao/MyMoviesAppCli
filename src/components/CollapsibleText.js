import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";


export default function CollapsibleText({
  textStyle,
  numberOfLines = undefined,
  children,
  contentContainerStyle,
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isTextLongEnough, setIsTextLongEnough] = useState(false);


  function handleOnTextLayout(event) {
    const textLineCount = event.nativeEvent.lines.length;

    if(numberOfLines && textLineCount > numberOfLines) {
      setIsTextLongEnough(true);
    }
  }

  function handleCollapseToggle() {
    setIsCollapsed(prev => !prev);
  }


  return(
    <View style={[contentContainerStyle, {gap: 8}]}>
      <Text
        style={textStyle}
        numberOfLines={isCollapsed ? numberOfLines : undefined}
        onTextLayout={handleOnTextLayout}
      >
        {children}
      </Text>

      {isTextLongEnough && (
        <TouchableOpacity onPress={handleCollapseToggle}>
          <Text style={textStyle}>
            {isCollapsed ? 'Ler mais' : 'Ler menos'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}