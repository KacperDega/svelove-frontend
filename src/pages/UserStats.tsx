import React, { useState, useRef, useEffect } from 'react';
import {  FaCommentDots,  FaCommentSlash,  FaArrowLeft,  FaArrowRight,} from 'react-icons/fa';
import Navbar from '../components/Navbar';
import ErrorPopup from '../components/ErrorPopup';
import { UserStatsDTO, AvailableStatsDto } from '../types';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { pl } from 'date-fns/locale';
import { format } from 'date-fns';
import { apiRequest } from '../api';



const UserStats: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(true);

  const [availablePeriods, setAvailablePeriods] = useState<AvailableStatsDto[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [stats, setStats] = useState<UserStatsDTO | null>(null);

  const datePickerRef = useRef<DatePicker | null>(null);

  useEffect(() => {
    const fetchAvailable = async () => {
      try {
        const data = await apiRequest<AvailableStatsDto[]>("/profile/stats/available");
        setAvailablePeriods(data);

        if (data.length > 0) {
          const latest = data[data.length - 1];
          const formatted = `${latest.year}-${String(latest.month).padStart(2, "0")}`;
          setSelectedPeriod(formatted);
          setStartDate(new Date(latest.year, latest.month - 1, 1));
        }
      } catch (err) {
        console.error(err);
        setError("Nie udało się pobrać dostępnych statystyk.");
      }
    };

    fetchAvailable();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      if (!selectedPeriod) return;
      const [year, month] = selectedPeriod.split("-").map(Number);

      try {
        const data = await apiRequest<UserStatsDTO>(`/profile/stats/${year}/${month}`);
        setStats(data);
      } catch (err) {
        console.error(err);
        setError("Nie udało się pobrać statystyk.");
      }
    };

    fetchStats();
  }, [selectedPeriod]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM");
      setSelectedPeriod(formattedDate);
      setStartDate(date);
    }
  };

  const openDatePicker = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  const getMonthName = (month: number, year: number): string => {
    const date = new Date(year, month - 1);
    return date.toLocaleString("pl-PL", { month: "long", year: "numeric" });
  };

  if (!stats) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          {error ? (
            <div className="flex flex-col items-center justify-center text-center px-4">
              <div className="text-6xl mb-4">😔</div>
              <p className="text-lg text-base-content">
                Nie udało się załadować statystyk.
                <br />
                Spróbuj ponownie za chwilę lub odśwież stronę.
              </p>
            </div>
          ) : (
            <span className="loading loading-spinner loading-lg"></span>
          )}
        </div>
        
        <ErrorPopup
          error={error}
          showError={showError}
          setShowError={setShowError}
        />
      </div>
    );
  }

  const formattedMonth = getMonthName(stats.month, stats.year);

  const swipeRightPercent = ((stats.rightSwipes / stats.totalSwipes) * 100).toFixed(1);
  const swipeLeftPercent = ((stats.leftSwipes / stats.totalSwipes) * 100).toFixed(1);

  const matchWithConvPercent = stats.matches
    ? ((stats.matchesWithConversation / stats.matches) * 100).toFixed(1)
    : "0";

  const matchWithoutConvPercent = stats.matches
    ? ((stats.matchesWithoutMessages / stats.matches) * 100).toFixed(1)
    : "0";

  const updatedDate = new Date(stats.updatedAt).toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow bg-base-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-extrabold text-content drop-shadow-lg inline-flex items-center justify-center select-none">
              Twoje cyfrowe podboje z miesiąca&nbsp;
              <span
                onClick={openDatePicker}
                className="underline decoration-dotted decoration-primary cursor-pointer hover:text-primary-focus transition-colors"
                title="Kliknij, żeby zmienić miesiąc"
              >
                {formattedMonth}
              </span>
            </h1>

            <DatePicker
              ref={datePickerRef}
              selected={startDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM"
              showMonthYearPicker
              className="hidden"
              disabledKeyboardNavigation
              locale={pl}
              minDate={
                availablePeriods.length > 0
                  ? new Date(
                      availablePeriods[0].year,
                      availablePeriods[0].month - 1,
                      1
                    )
                  : undefined
              }
              maxDate={
                availablePeriods.length > 0
                  ? new Date(
                      availablePeriods[availablePeriods.length - 1].year,
                      availablePeriods[availablePeriods.length - 1].month - 1,
                      1
                    )
                  : undefined
              }
            />

            <p className="text-base-content mt-2 opacity-70">
              Zobacz, jak Ci poszło w tym miesiącu 👀
            </p>
          </div>

          <div className="card bg-neutral shadow-xl border border-secondary">
            <div className="card-body space-y-8">
              {/* SWIPES */}
              <section>
                <div className="text-center mb-4">
                  <div className="stat bg-base-200 rounded-lg inline-block p-6 shadow-md shadow-base-100">
                    <div className="stat-title">Łącznie swipe'ów</div>
                    <div className="stat-value text-info">{stats.totalSwipes}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center">
                  <div className="stat bg-base-200 rounded-lg p-4 text-center shadow-md shadow-base-100">
                    <div className="stat-figure text-secondary mx-auto">
                      <FaArrowLeft />
                    </div>
                    <div className="stat-title">W lewo</div>
                    <div className="stat-value text-secondary">{stats.leftSwipes}</div>
                    <div className="stat-desc">{swipeLeftPercent}%</div>
                  </div>

                  <div className="stat bg-base-200 rounded-lg p-4 text-center shadow-md shadow-base-100">
                    <div className="stat-figure text-accent mx-auto">
                      <FaArrowRight />
                    </div>
                    <div className="stat-title">W prawo</div>
                    <div className="stat-value text-accent">{stats.rightSwipes}</div>
                    <div className="stat-desc">{swipeRightPercent}%</div>
                  </div>
                </div>
              </section>

              <div className="divider">Dopasowania</div>

              {/* MATCHES */}
              <section>
                <div className="text-center mb-4">
                  <div className="stat bg-base-200 rounded-lg p-4 text-center shadow-md shadow-base-100">
                    <div className="stat-title">Dopasowania</div>
                    <div className="stat-value text-primary">{stats.matches}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center">
                  <div className="stat bg-base-200 rounded-lg p-4 text-center shadow-md shadow-base-100">
                    <div className="stat-figure text-success mx-auto">
                      <FaCommentDots />
                    </div>
                    <div className="stat-title">Z rozmową</div>
                    <div className="stat-value text-success">{stats.matchesWithConversation}</div>
                    <div className="stat-desc">{matchWithConvPercent}%</div>
                  </div>

                  <div className="stat bg-base-200 rounded-lg p-4 text-center shadow-md shadow-base-100">
                    <div className="stat-figure text-error mx-auto">
                      <FaCommentSlash />
                    </div>
                    <div className="stat-title">Bez wiadomości</div>
                    <div className="stat-value text-error">{stats.matchesWithoutMessages}</div>
                    <div className="stat-desc">{matchWithoutConvPercent}%</div>
                  </div>
                </div>
              </section>

              <div className="text-right text-sm text-base-content/60 italic mt-6">
                ⏰ Ostatnia aktualizacja:{" "}
                <span className="font-mono">{updatedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ErrorPopup error={error} showError={showError} setShowError={setShowError}/>
    </div>
  );
};

export default UserStats;