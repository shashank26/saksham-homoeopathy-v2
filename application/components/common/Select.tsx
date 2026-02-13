import React from "react";
import { Adapt, Select, SelectProps, Sheet, YStack } from "tamagui";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { themeColors } from "@/themes/themes";

export function Dropdown(
  props: SelectProps & {
    trigger?: React.ReactNode;
    items?: { name: string; value: string }[];
  }
) {
  return (
    <Select
      value={props.value}
      onValueChange={props.onValueChange}
      disablePreventBodyScroll
      {...props}
    >
      {props?.trigger || (
        <Select.Trigger
          maxWidth={220}
          iconAfter={<MaterialIcon name="arrow-drop-down" size={20} />}
        >
          <Select.Value placeholder={props.value} fontFamily={"$js5"} fontSize={"$2"} />
        </Select.Trigger>
      )}

      <Adapt platform="touch">
        <Sheet
          native={!!props.native}
          modal
          dismissOnSnapToBottom
          animation="medium"
        >
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            backgroundColor="$shadowColor"
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.ScrollUpButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <MaterialIcon name="arrow-drop-up" size={20} />
          </YStack>
        </Select.ScrollUpButton>

        <Select.Viewport
          // to do animations:
          // animation="quick"
          // animateOnly={['transform', 'opacity']}
          // enterStyle={{ o: 0, y: -10 }}
          // exitStyle={{ o: 0, y: 10 }}
          minWidth={200}
        >
          <Select.Group>
            {React.useMemo(
              () =>
                props.items?.map((item, i) => {
                  return (
                    <Select.Item
                      index={i}
                      key={item.name}
                      value={item.name.toLowerCase()}
                    >
                      <Select.ItemText fontFamily={"$js5"} fontSize={"$2"}>{item.name}</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <MaterialIcon
                          name="check"
                          size={20}
                          color={themeColors.accent}
                        />
                      </Select.ItemIndicator>
                    </Select.Item>
                  );
                }),
              [props.items]
            )}
          </Select.Group>
          {/* Native gets an extra icon */}
          {props.native && (
            <YStack
              position="absolute"
              right={0}
              top={0}
              bottom={0}
              alignItems="center"
              justifyContent="center"
              width={"$4"}
              pointerEvents="none"
            >
              <MaterialIcon
                name="arrow-drop-down"
                size={24}
                color={themeColors.accent}
                style={{ transform: [{ translateY: -2 }] }}
              />
            </YStack>
          )}
        </Select.Viewport>

        <Select.ScrollDownButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$4"
        >
          <YStack zIndex={10}>
            <MaterialIcon name="arrow-drop-down" size={20} />
          </YStack>
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  );
}
