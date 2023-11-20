import { useState } from "react";
import { Image, View } from "react-native";

export default function CustomImage({style, source, placeholder}) {

  const [isLoading, setIsLoading] = useState(true);


  function isSourceValid() {
    if(typeof source.uri === 'string' || typeof source === 'number') {
      return true;
    }
    return false;
  }
  

  return(
    <View>
      {/* placeholder */}
      {(isLoading && placeholder) && (
        <Image
          style={[style, {position: "absolute"}]}
          source={placeholder}
        />
      )}

      {/* image */}
      <Image
        style={style}
        source={isSourceValid() ? source : placeholder}
        onLoadEnd={() => setIsLoading(false)}
      />
    </View>
  );
}