import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// NOTE: may be possible to remove contentContainerStyle if gaps are added on screens


export default function CollapsibleText({
  textStyle,
  numberOfLines = 0,
  children,
  contentContainerStyle,
}) {

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isTextLongEnough, setIsTextLongEnough] = useState(false);


  function handleOnTextLayout(event) {
    const textNumberOfLines = event.nativeEvent.lines.length;
    
    if(numberOfLines > 0 && textNumberOfLines > numberOfLines) {
      setIsTextLongEnough(true);
    }
  }

  function handleCollapseToggle() {
    setIsCollapsed(prev => !prev);
  }


  return(
    <View style={[contentContainerStyle, {gap: 10}]}>
      <Text
        style={textStyle}
        numberOfLines={isCollapsed ? numberOfLines : 0}
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