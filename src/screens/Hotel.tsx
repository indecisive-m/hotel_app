import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  Text,
  Image,
  View,
  useWindowDimensions,
  ViewStyle,
  TextStyle,
  FlatListProps,
} from "react-native";
import React, { useContext, useRef, useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../constants/types";
import { QueryClient, useQueries, useQuery, useQueryClient } from "react-query";
import useGetHotelDetails from "api/useGetHotelDetails";

import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import useGetHotelInfo from "api/useGetHotelInfo";
import RoomDetailsCard from "components/RoomDetailsCard";
import {
  borderRadius,
  darkTheme,
  fontSize,
  lightTheme,
  spacing,
} from "constants/styles";
import { ThemeContext } from "constants/context";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import BackButton from "components/BackButton";

type Props = NativeStackScreenProps<StackParamList, "Hotel">;

const Hotel = ({ route, navigation }: Props) => {
  const [reviewsShown, setReviewsShown] = useState(false);
  const [showAmenities, setShowAmenities] = useState(false);
  const { theme } = useContext(ThemeContext);
  const color = theme === "dark" ? darkTheme : lightTheme;
  const { hotelId } = route.params;

  const { width } = useWindowDimensions();
  const queryClient = useQueryClient();

  const mapViewRef = useRef<MapView>(null);
  const scrollRef = useAnimatedRef<Animated.FlatList>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const { data, isLoading, status, isSuccess, refetch } = useQuery({
    queryKey: ["hotel", hotelId],
    queryFn: () => useGetHotelDetails(hotelId, false),
  });

  const IMG_HEIGHT = width;

  const $container: ViewStyle = {
    backgroundColor: color.neutral,
    padding: spacing.small,
    rowGap: spacing.medium,
  };

  const $addressContainer: ViewStyle = {
    backgroundColor: color.neutral,
    padding: spacing.small,
    borderRadius: borderRadius.medium,
    rowGap: spacing.small,
  };

  const $ratingContainer: ViewStyle = {
    flexDirection: "row",
    gap: spacing.small,
    alignItems: "baseline",
    paddingHorizontal: spacing.small,
  };

  const $headerContainer: ViewStyle = {
    padding: spacing.small,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    backgroundColor: color.accent,
    borderTopRightRadius: borderRadius.medium,
    borderTopLeftRadius: borderRadius.medium,
    borderBottomWidth: spacing.micro,
    borderBottomColor: color.accent,
  };

  const $detailsItem: TextStyle = {
    fontFamily: "Rubik_400Regular",
    fontSize: fontSize.medium,
    color: color.font,
  };

  const $headerText: TextStyle = {
    fontSize: fontSize.extraLarge,
    fontFamily: "CormorantGaramond_700Bold",
    color: color.font,
  };

  const $summary: TextStyle = {
    padding: spacing.small,
    backgroundColor: color.secondary,
    fontSize: fontSize.small,
    fontFamily: "Rubik_400Regular",
    borderTopRightRadius: borderRadius.medium,
    borderTopLeftRadius: borderRadius.medium,
    color: color.font,
  };

  const $hotelNameText: TextStyle = {
    fontSize: fontSize.extraLarge,
    fontFamily: "CormorantGaramond_700Bold",
    paddingHorizontal: spacing.medium,
    color: color.font,
  };

  const $addressText: TextStyle = {
    fontSize: fontSize.small,
    marginTop: spacing.tiny,
    fontFamily: "Rubik_400Regular",
    color: color.font,
  };

  const $phoneText: TextStyle = {
    fontSize: fontSize.small,
    fontFamily: "Rubik_400Regular_Italic",
    color: color.font,
  };

  const $phoneContainer: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.small,
    marginTop: spacing.small,
    backgroundColor: color.secondary,
    padding: spacing.small,
    borderBottomLeftRadius: borderRadius.medium,
    borderBottomRightRadius: borderRadius.medium,
  };

  const $ratingText: TextStyle = {
    fontSize: fontSize.medium,
    fontFamily: "Rubik_400Regular",
    color: color.font,
  };

  const $map: ViewStyle = {
    flex: 1,
    height: 100,
    width: "auto",
  };

  const $expandedContainer: ViewStyle = {
    backgroundColor: color.secondary,
    padding: spacing.small,
    marginTop: -spacing.medium,
    borderBottomLeftRadius: borderRadius.medium,
    borderBottomRightRadius: borderRadius.medium,
    rowGap: spacing.extraSmall,
  };

  const $flexRow: ViewStyle = {
    flexDirection: "row",
    backgroundColor: color.neutral,
    borderRadius: borderRadius.small,
    alignItems: "center",
    gap: spacing.medium,
    padding: spacing.small,
  };

  const $icon: TextStyle = {
    width: "13%",
    borderRightColor: color.accent,
    borderRightWidth: 2,
    fontSize: fontSize.large,
    color: color.accent,
  };

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1],
          ),
        },
      ],
    };
  });

  const hotelName = data?.hotel?.name;

  const hotelInfo = useQuery({
    queryKey: ["hotelInfo", hotelName],
    queryFn: () => useGetHotelInfo(),
    enabled: !!hotelName,
  });

  if (status === "error") {
    navigation.replace("Error");
  }

  const places = hotelInfo.data?.data?.places[0];
  const photos = hotelInfo.data?.photoUris;

  if (isLoading || hotelInfo.isLoading || !hotelInfo.data?.photoUris) {
    // navigation.setOptions({ headerShown: false });
    return (
      <ActivityIndicator
        size={"large"}
        style={{
          flex: 1,
          flexBasis: 1,
          justifyContent: "center",
          alignSelf: "center",
          width: "100%",
          backgroundColor: color.neutral,
        }}
        color={color.font}
      />
    );
  }

  const renderedImages: ListRenderItem<string> = ({ item }) => {
    return (
      <Image
        source={{ uri: item }}
        key={item}
        style={[
          {
            height: width,
            width: width,
            resizeMode: "cover",
            overflow: "hidden",
          },
        ]}
      />
    );
  };

  const headerComponent = (
    <View style={$container}>
      <View style={$addressContainer}>
        <Text style={$hotelNameText}>{hotelName}</Text>
        <View style={$ratingContainer}>
          <FontAwesome name="star" size={22} color="orange" />
          <Text style={$ratingText}>
            {places?.rating}
            <Text
              style={{
                fontSize: fontSize.small,
                fontFamily: "Rubik_400Regular",
              }}
            >
              / 5
            </Text>
          </Text>
          <Text style={{ fontFamily: "Rubik_400Regular_Italic" }}>
            ({places?.userRatingCount} total ratings)
          </Text>
        </View>
        <Text style={$summary}>{places?.editorialSummary.text}</Text>
        <View>
          <Pressable>
            <MapView
              provider={PROVIDER_GOOGLE}
              ref={mapViewRef}
              camera={{
                center: {
                  latitude: data?.hotel?.latitude,
                  longitude: data?.hotel?.longitude,
                },
                zoom: 14,
                heading: 0,
                pitch: 0,
              }}
              showsBuildings={true}
              minZoomLevel={6}
              scrollEnabled={false}
              style={$map}
            >
              <Marker
                title={hotelName}
                coordinate={{
                  latitude: data?.hotel?.latitude,
                  longitude: data?.hotel?.longitude,
                }}
              />
            </MapView>
          </Pressable>

          <Text style={$addressText}>{places?.formattedAddress}</Text>
          <Pressable style={$phoneContainer}>
            <FontAwesome name={"phone"} size={20} style={$icon} />
            <Text style={$phoneText}>{places?.internationalPhoneNumber}</Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        onPress={() => setShowAmenities(!showAmenities)}
        style={$headerContainer}
      >
        <Text style={[$headerText, { color: "black" }]}>Amenities</Text>

        <Ionicons
          name={showAmenities ? "chevron-up" : "chevron-down"}
          size={24}
          color="black"
        />
      </Pressable>
      {showAmenities ? (
        <View style={$expandedContainer}>
          <View style={$flexRow}>
            <FontAwesome name="shower" style={$icon} />
            <Text style={$detailsItem}>Shower</Text>
          </View>
          <View style={$flexRow}>
            <FontAwesome name="bathtub" style={$icon} />
            <Text style={$detailsItem}>Bath</Text>
          </View>
          <View style={$flexRow}>
            <Ionicons name="wifi" style={$icon} />

            <Text style={$detailsItem}>WiFi</Text>
          </View>
          <View style={$flexRow}>
            <MaterialCommunityIcons name="hair-dryer" style={$icon} />
            <Text style={$detailsItem}>Hairdryer</Text>
          </View>
          <View style={$flexRow}>
            <Entypo name="tv" style={$icon} />
            <Text style={$detailsItem}>TV</Text>
          </View>
          {places?.allowsDogs ? (
            <View style={$flexRow}>
              <MaterialIcons name="pets" style={$icon} />
              <Text style={$detailsItem}>Pets Allowed</Text>
            </View>
          ) : (
            <View style={$flexRow}>
              <FontAwesome name="ban" style={$icon} />
              <Text style={$detailsItem}>No pets</Text>
            </View>
          )}
          {places?.accessibilityOptions.wheelchairAccessibleEntrance ? (
            <View style={$flexRow}>
              <FontAwesome5 name="wheelchair" style={$icon} />
              <Text style={$detailsItem}>Wheelchair accessible</Text>
            </View>
          ) : null}
          {places?.accessibilityOptions.wheelchairAccessibleParking ? (
            <View style={$flexRow}>
              <FontAwesome5 name="wheelchair" style={$icon} />
              <Text style={$detailsItem}>Disabled parking</Text>
            </View>
          ) : null}
        </View>
      ) : null}
      <Pressable
        style={$headerContainer}
        onPress={() =>
          navigation.navigate("ReviewsModal", { reviews: places?.reviews })
        }
      >
        <Text style={[$headerText, { color: "black" }]}>Reviews</Text>
        <Ionicons
          name={reviewsShown ? "chevron-up" : "chevron-forward"}
          size={24}
          color="black"
        />
      </Pressable>
    </View>
  );

  return (
    <Animated.ScrollView
      ref={scrollRef}
      scrollEventThrottle={16}
      style={{ backgroundColor: color.neutral, flex: 1 }}
    >
      <Animated.FlatList
        data={hotelInfo.data?.photoUris}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        renderItem={renderedImages}
        style={[{ flex: 1 }, imageAnimatedStyle]}
      />
      <FlatList
        data={data?.data}
        renderItem={({ item }) => <RoomDetailsCard item={item} />}
        style={{ flex: 1 }}
        scrollEnabled={true}
        ListHeaderComponent={headerComponent}
      />
    </Animated.ScrollView>
  );
};

export default Hotel;
