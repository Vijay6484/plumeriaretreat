import React, { useState, useEffect, useCallback } from "react";
import { DayPicker } from "react-day-picker";
import { format, addDays, isBefore, startOfDay, isSameDay } from "date-fns";
import "react-day-picker/dist/style.css";

interface AdditionalRoomInfo {
  date: Date;
  additionalRooms: number;
  adultPrice: number | null;
  childPrice: number | null;
}

interface Accommodation {
  id: number;
  rooms: number;
  adult_price: number;
  child_price: number;
}

interface AvailabilityCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date) => void;
  accommodationId: string;
  minDate?: Date;
}

const API_BASE_URL = "https://a.plumeriaretreat.com";

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  selectedDate,
  onDateSelect,
  accommodationId,
  minDate = new Date(),
}) => {
  const [fullyBooked, setFullyBooked] = useState<Date[]>([]);
  const [hasAdditionalRooms, setHasAdditionalRooms] = useState<Date[]>([]);
  const [hasCustomPricing, setHasCustomPricing] = useState<Date[]>([]);
  const [additionalRoomsInfo, setAdditionalRoomsInfo] = useState<AdditionalRoomInfo[]>([]);
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [bookedRoom, setBookedRoom] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);

  const fetchAccommodation = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/admin/properties/accommodations/${accommodationId}`
      );
      if (!res.ok) throw new Error("Failed to fetch accommodation");
      const data = await res.json();
      setAccommodation({
        id: data.id,
        rooms: data.rooms,
        adult_price: data.adult_price,
        child_price: data.child_price,
      });
    } catch (err) {
      console.error(err);
    }
  }, [accommodationId]);

  const fetchAdditionalRooms = useCallback(async () => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/admin/calendar/blocked-dates/${accommodationId}`
    );
    const json = await res.json();

    if (json.success) {
      const dates: AdditionalRoomInfo[] = json.data.map((d: any) => {
        const roomsRaw = d.rooms;
        let additionalRooms = 0;

        // null / "null" / "" should be treated as 0
        if (roomsRaw !== null && roomsRaw !== "null" && roomsRaw !== "") {
          additionalRooms = parseInt(roomsRaw, 10) || 0;
        }

        return {
          date: new Date(d.blocked_date),
          additionalRooms,
          adultPrice: d.adult_price ? parseFloat(d.adult_price) : null,
          childPrice: d.child_price ? parseFloat(d.child_price) : null,
        };
      });

      setAdditionalRoomsInfo(dates);
    }
  } catch (err) {
    console.error("Failed to fetch additional rooms info", err);
  }
}, [accommodationId]);


  const fetchBookedRooms = useCallback(
    async (date: Date) => {
      const formattedDate = format(date, "yyyy-MM-dd");
      try {
        const response = await fetch(
          `${API_BASE_URL}/admin/bookings/room-occupancy?check_in=${formattedDate}&id=${accommodation?.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setBookedRoom(data.total_rooms || 0);
        } else {
          setBookedRoom(0);
        }
      } catch (error) {
        console.error("Error fetching booked rooms:", error);
        setBookedRoom(0);
      }
    },
    [accommodation]
  );

  const calculateAvailableRoomsForDate = useCallback(
  (date: Date) => {
    if (!accommodation) return 0;

    const dateObj = startOfDay(date);
    const baseRooms = accommodation.rooms;

    const additionalInfo = additionalRoomsInfo.find((a) =>
      isSameDay(a.date, dateObj)
    );

    // Default 0 if no info
    const extraRooms = additionalInfo ? additionalInfo.additionalRooms || 0 : 0;

    const totalRoomsForDay = baseRooms + extraRooms;
    const availableRooms = totalRoomsForDay - bookedRoom;

    return Math.max(0, availableRooms);
  },
  [accommodation, additionalRoomsInfo, bookedRoom]
);


  const calculateDateTypes = useCallback(() => {
    const today = startOfDay(new Date());
    const fully: Date[] = [];
    const additional: Date[] = [];
    const customPricing: Date[] = [];

    additionalRoomsInfo.forEach(({ date, additionalRooms, adultPrice, childPrice }) => {
      if (isBefore(date, today)) return;

      const availableRooms = calculateAvailableRoomsForDate(date);
      if (availableRooms <= 0) {
        fully.push(date);
      } else if (additionalRooms > 0) {
        additional.push(date);
      }
      if (adultPrice !== null || childPrice !== null) {
        customPricing.push(date);
      }
    });

    setFullyBooked(fully);
    setHasAdditionalRooms(additional);
    setHasCustomPricing(customPricing);
  }, [additionalRoomsInfo, calculateAvailableRoomsForDate]);

  const isDateDisabled = useCallback(
    (date: Date) => {
      const isPast = isBefore(date, startOfDay(minDate));
      return isPast || fullyBooked.some((d) => isSameDay(d, date));
    },
    [fullyBooked, minDate]
  );

  const handleDateSelect = (date: Date | undefined) => {
    if (!date || isDateDisabled(date)) return;
    onDateSelect(date);
    setShowCalendar(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAccommodation(), fetchAdditionalRooms()]);
      setLoading(false);
    };

    loadData();
  }, [fetchAccommodation, fetchAdditionalRooms]);

  useEffect(() => {
    if (selectedDate) {
      fetchBookedRooms(selectedDate);
    }
  }, [selectedDate, fetchBookedRooms]);

  useEffect(() => {
    calculateDateTypes();
  }, [additionalRoomsInfo, bookedRoom, calculateDateTypes]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <button
        type="button"
        className="w-full px-4 py-2 border rounded-lg bg-white text-left focus:ring-2 focus:ring-green-600"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        {selectedDate
          ? `${format(selectedDate, "dd MMM yyyy")}`
          : "Select your stay date"}
      </button>

      {showCalendar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Check-in Date</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowCalendar(false)}
              >
                ✕
              </button>
            </div>

            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              numberOfMonths={1}
              fromDate={minDate}
              toDate={addDays(new Date(), 365)}
              disabled={isDateDisabled}
              modifiers={{
                fullyBooked,
                hasAdditionalRooms,
                hasCustomPricing,
              }}
              modifiersClassNames={{
                fullyBooked:
                  "bg-red-100 text-gray-400 line-through cursor-not-allowed",
                hasAdditionalRooms:
                  "bg-green-100 relative has-additional-rooms",
                hasCustomPricing:
                  "bg-purple-100 relative has-custom-pricing",
                selected:
                  "bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:bg-blue-600",
              }}
              className="mx-auto"
            />

            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-100 mr-2"></div>
                <span>Fully Booked</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 mr-2 relative has-additional-rooms"></div>
                <span>Additional Rooms Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-100 mr-2 relative has-custom-pricing"></div>
                <span>Special Pricing</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-white border border-gray-300 mr-2"></div>
                <span>Standard Availability</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
