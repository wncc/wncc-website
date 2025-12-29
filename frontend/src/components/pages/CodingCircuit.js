import React, { useState, useRef, useEffect } from "react";
import {
  Code,
  Trophy,
  Calendar,
  Users,
  Target,
  Award,
  Clock,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Medal,
  Book,
  Zap,
  Brain,
  Activity,
  Search,
  ArrowDown,
  Download,
} from "lucide-react";
import Card from "../common/Card";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const CodingCircuit = () => {
  const [selectedContest, setSelectedContest] = useState("overall");
  const [expandedContest, setExpandedContest] = useState(null);
  const [viewMode, setViewMode] = useState("contest"); // "contest" or "year"
  const [selectedYear, setSelectedYear] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadedData, setLoadedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const specificRankingsRef = useRef(null);
  const leaderboardsRef = useRef(null);

  // Mock data for upcoming contests
  const upcomingContests = [
    {
      id: 2,
      title: "Coding Circuit Contest #2",
      date: "January 24, 2026",
      time: "20:00 IST",
      duration: "3 hours",
      difficulty: "Medium",
      problems: 6,
      registrationOpen: false,
    },
    {
      id: 3,
      title: "Coding Circuit Contest #3",
      date: "January 31, 2026",
      time: "20:00 IST",
      duration: "3 hours",
      difficulty: "Hard",
      problems: 6,
      registrationOpen: false,
    },
  ];

  // Mock data for past contests
  const pastContests = [
    {
      id: 1,
      title: "Coding Circuit Contest #1",
      date: "September 5, 2025",
      participants: 450,
      problems: 5,
      hackerrankUrl: "https://www.hackerrank.com/coding-circuit-1-contest-1/",
    },
  ];

  // Function to load data from Excel file
  const loadDataFromExcel = async (filePath) => {
    try {
      const response = await fetch(filePath);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      return data;
    } catch (error) {
      console.error('Error loading Excel file:', error);
      return [];
    }
  };

  // Load data from Excel file on component mount
  useEffect(() => {
    loadDataFromExcel('/CC1 Ranks.xlsx').then(data => {
      // Process and transform the data
      const processedData = data.map((row) => ({
        rank: row.Rank,
        name: row.Name,
        rollNo: row['LDAP ID'] ? row['LDAP ID'].split('@')[0] : '',
        ccid: row.CCID,
        hackerrank_id: row.HackerrankID,
        year: row['Year of Study'],
      }));
      setLoadedData(processedData);
    });
  }, []);

  // Reset pagination when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Use loaded data or fallback to empty array
  const contest1Results = loadedData;
  const overallRankings = loadedData;

  const benefits = [
    {
      title: "Improve Problem Solving",
      icon: <Target className="w-6 h-6 text-cyan-400" />,
      description:
        "Sharpen your algorithmic thinking and problem-solving skills through challenging contests.",
    },
    {
      title: "Competitive Rankings",
      icon: <TrendingUp className="w-6 h-6 text-cyan-400" />,
      description:
        "Track your progress with live rankings and compete with peers across IIT Bombay.",
    },
    {
      title: "Win Prizes & Recognition",
      icon: <Trophy className="w-6 h-6 text-cyan-400" />,
      description:
        "Top performers receive certificates, prizes, and recognition from WnCC.",
    },
    {
      title: "Regular Practice",
      icon: <Clock className="w-6 h-6 text-cyan-400" />,
      description:
        "Consistent contests throughout the semester to keep your competitive programming skills sharp.",
    },
  ];

  const stats = [
    {
      label: "Total Registrations",
      value: "950+",
      icon: <Users className="w-6 h-6" />,
    },
    {
      label: "Contest Held",
      value: "1",
      icon: <Trophy className="w-6 h-6" />,
    },
    {
      label: "Problems Solved",
      value: "2000+",
      icon: <Code className="w-6 h-6" />,
    },
    {
      label: "Active Coders",
      value: "200+",
      icon: <Activity className="w-6 h-6" />,
    },
  ];

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <div className="flex items-center gap-1 text-yellow-400">
          <Medal className="w-5 h-5" />
          <span className="font-bold">1st</span>
        </div>
      );
    } else if (rank === 2) {
      return (
        <div className="flex items-center gap-1 text-gray-400">
          <Medal className="w-5 h-5" />
          <span className="font-bold">2nd</span>
        </div>
      );
    } else if (rank === 3) {
      return (
        <div className="flex items-center gap-1 text-orange-400">
          <Medal className="w-5 h-5" />
          <span className="font-bold">3rd</span>
        </div>
      );
    }
    return <span className="font-bold text-gray-400">#{rank}</span>;
  };

  const filterResults = (results) => {
    if (!searchQuery) return results;
    const query = searchQuery.toLowerCase();
    return results.filter(
      (result) =>
        (result.name && result.name.toLowerCase().includes(query)) ||
        (result.rollNo && result.rollNo.toLowerCase().includes(query)) ||
        (result.ccid && result.ccid.toLowerCase().includes(query))
    );
  };

  const getYearWiseRankings = (year) => {
    let yearRankings;
    if (year === "other") {
      // Filter for 5th, PG, PhD, and any other non 1-4 years
      yearRankings = overallRankings.filter((r) => {
        const yearStr = String(r.year).toLowerCase();
        return !['1st', '2nd', '3rd', '4th'].includes(yearStr);
      });
    } else {
      // Filter for specific year (1st, 2nd, 3rd, 4th)
      const targetYear = `${year}${year === "1" ? "st" : year === "2" ? "nd" : year === "3" ? "rd" : "th"}`;
      yearRankings = overallRankings.filter((r) => String(r.year).toLowerCase() === targetYear.toLowerCase());
    }
    return yearRankings.map((r, index) => ({ ...r, rank: index + 1 }));
  };

  const downloadPDF = (data, title) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(6, 182, 212); // Cyan color
    doc.text(title, 14, 20);
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    
    // Prepare table data
    const tableData = data.map(row => [
      row.rank,
      row.name || 'N/A',
      row.rollNo || 'N/A',
      row.ccid || 'N/A',
      row.hackerrank_id || 'N/A'
    ]);
    
    // Add table using autoTable
    autoTable(doc, {
      startY: 35,
      head: [['Rank', 'Name', 'Roll No', 'CC ID', 'HackerRank ID']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [6, 182, 212],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });
    
    // Save the PDF
    doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
  };

  const renderRankingsTable = (results, showPagination = true) => {
    const filteredResults = filterResults(results);

    if (filteredResults.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No results found matching your search.</p>
        </div>
      );
    }

    // Pagination logic
    const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedResults = showPagination ? filteredResults.slice(startIndex, endIndex) : filteredResults;

    return (
      <>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                  Roll No
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                  CC ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                  HackerRank ID
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedResults.map((result, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-4 py-3">{getRankBadge(result.rank)}</td>
                  <td className="px-4 py-3 text-white font-medium">
                    {result.name}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{result.rollNo}</td>
                  <td className="px-4 py-3">
                    <span className="text-cyan-400 font-mono text-sm">
                      {result.ccid}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-purple-400 font-mono text-sm">
                      {result.hackerrank_id}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showPagination && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredResults.length)} of {filteredResults.length} entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentPage === 1
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg transition-all ${
                      currentPage === page
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentPage === totalPages
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section - Different Layout */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10 rounded-2xl blur-3xl"></div>
        <div className="relative border border-cyan-500/20 rounded-2xl p-8 md:p-12 bg-gray-900/50 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="inline-block">
                <span className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-semibold border border-cyan-500/30">
                  <Zap className="w-4 h-4 inline mr-2" />
                  Competitive Programming Series
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold">
                <span className="text-white">Coding</span>{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                  Circuit
                </span>
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl">
                This is not just another set of contests — it’s IIT Bombay’s
                premier CP arena, spanning several rounds across Autumn 2025 & Spring
                2026, where the brightest minds will battle it out for prizes,
                recognition and a place among the campus’ top problem solvers.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-4">
                <a
                  href="https://shore-character-350.notion.site/Coding-Circuit-Rules-24340925f702804c89fbe1ea12e6eef0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 font-semibold"
                >
                  <Book className="w-5 h-5" /> Official Notion Page
                </a>
                <a
                  href="https://chat.whatsapp.com/CpuP8gZyPJk6vEK9H4WthY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-6 py-3 rounded-lg flex items-center gap-2 transition-all font-semibold"
                >
                  <Users className="w-5 h-5" /> Join Community
                </a>
                <button
                  onClick={() => {
                    leaderboardsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-6 py-3 rounded-lg flex items-center gap-2 transition-all font-semibold"
                >
                  <Trophy className="w-5 h-5" /> View Rankings
                </button>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="relative w-48 h-48 md:w-64 md:h-64">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full animate-pulse"></div>
                <div className="absolute inset-8 bg-gray-900 rounded-full flex items-center justify-center border-2 border-cyan-500/30">
                  <Brain className="w-20 h-20 md:w-32 md:h-32 text-cyan-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      {/* <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/20 rounded-xl p-6 text-center hover:border-cyan-500/40 transition-all"
            >
              <div className="flex justify-center mb-2 text-cyan-400">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section> */}

      {/* About Coding Circuit - Side by Side Layout */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold">
            <span className="text-white">What is</span>{" "}
            <span className="text-cyan-400">Coding Circuit</span>
            <span className="text-white">?</span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Coding Circuit is WnCC's competitive programming initiative that
            hosts regular coding contests throughout the academic year. Whether
            you're a beginner looking to improve your problem-solving skills or
            an experienced coder aiming for the top of the leaderboard, Coding
            Circuit provides a platform to test and enhance your abilities.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            Each contest features carefully curated problems ranging from easy
            to challenging, with live rankings, instant feedback, and detailed
            editorials to help you learn and grow as a programmer.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="p-4 hover:border-cyan-500/40 transition-all"
            >
              <div className="mb-3">{benefit.icon}</div>
              <h3 className="text-sm font-semibold text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-xs text-gray-400">{benefit.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Upcoming Contests - Timeline Style */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold text-white">
            Upcoming <span className="text-cyan-400">Contests</span>
          </h2>
          <p className="text-gray-400">
            Mark your calendars for these exciting competitions
          </p>
        </div>
        <div className="space-y-4">
          {upcomingContests.map((contest, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-cyan-500/20 p-2 rounded-lg">
                      <Trophy className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {contest.title}
                      </h3>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                          contest.difficulty === "Easy"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : contest.difficulty === "Medium"
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {contest.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      {contest.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      {contest.time} • {contest.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Code className="w-4 h-4 text-cyan-400" />
                      {contest.problems} Problems
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {contest.registrationOpen ? (
                    <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg transition-all shadow-lg shadow-cyan-500/20 font-semibold">
                      Register Now
                    </button>
                  ) : (
                    <button
                      disabled
                      className="bg-gray-700 text-gray-400 px-6 py-3 rounded-lg cursor-not-allowed"
                    >
                      Opens Soon
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Past Contests - Clickable Cards */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold text-white">
            Past <span className="text-cyan-400">Contests</span>
          </h2>
          <p className="text-gray-400">View previous contests on HackerRank</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {pastContests.map((contest) => (
            <a
              key={contest.id}
              href={contest.hackerrankUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 hover:scale-105 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className="bg-cyan-500/20 p-3 rounded-lg group-hover:bg-cyan-500/30 transition-colors">
                  <Award className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {contest.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      {contest.date}
                    </span>
                    {/* <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-cyan-400" />
                      {contest.participants} participants
                    </span>
                    <span>•</span> */}
                    <span className="flex items-center gap-1">
                      <Code className="w-4 h-4 text-cyan-400" />
                      {contest.problems} problems
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-2 text-cyan-400 text-sm font-semibold group-hover:gap-3 transition-all">
                    View on HackerRank
                    <span className="text-lg">→</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Past Contests & Rankings */}
      <section ref={leaderboardsRef} className="space-y-8 scroll-mt-8">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold text-white">
            Leaderboards & <span className="text-cyan-400">Results</span>
          </h2>
          <p className="text-gray-400">Track performance across contests</p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, roll no, or CC ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex bg-gray-800 rounded-lg p-1 border border-gray-700">
            <button
              onClick={() => {
                setViewMode("contest");
                setSelectedContest("overall");
                setCurrentPage(1);
              }}
              className={`px-6 py-2 rounded-md transition-all font-semibold ${
                viewMode === "contest"
                  ? "bg-cyan-500 text-white"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Contest-wise
            </button>
            <button
              onClick={() => {
                setViewMode("year");
                setSelectedYear("1");
                setCurrentPage(1);
              }}
              className={`px-6 py-2 rounded-md transition-all font-semibold ${
                viewMode === "year"
                  ? "bg-cyan-500 text-white"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Year-wise
            </button>
          </div>
        </div>

        {/* Contest Selector - Tab Style */}
        {viewMode === "contest" && (
          <div className="border-b border-gray-700">
            <div className="flex flex-wrap gap-2">
              {pastContests.map((contest) => (
                <button
                  key={contest.id}
                  onClick={() => {
                    setSelectedContest(`contest${contest.id}`);
                    setCurrentPage(1);
                    setTimeout(() => {
                      specificRankingsRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }, 150);
                  }}
                  className={`px-6 py-3 font-semibold transition-all relative ${
                    selectedContest === `contest${contest.id}`
                      ? "text-cyan-400"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <Award className="w-4 h-4 inline mr-2" />
                  Contest #{contest.id}
                  {selectedContest === `contest${contest.id}` && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Year Selector - Tab Style */}
        {viewMode === "year" && (
          <div className="border-b border-gray-700">
            <div className="flex flex-wrap gap-2">
              {["1", "2", "3", "4", "other"].map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setCurrentPage(1);
                    setTimeout(() => {
                      specificRankingsRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }, 150);
                  }}
                  className={`px-6 py-3 font-semibold transition-all relative ${
                    selectedYear === year
                      ? "text-cyan-400"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <Award className="w-4 h-4 inline mr-2" />
                  {year === "1"
                    ? "1st"
                    : year === "2"
                    ? "2nd"
                    : year === "3"
                    ? "3rd"
                    : year === "4"
                    ? "4th"
                    : "Other"}{" "}
                  {year !== "other" && "Year"}
                  {selectedYear === year && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Overall Rankings - Always Visible */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
            <div>
              <h3 className="text-2xl font-bold text-cyan-400 mb-1">
                Overall Leaderboard
              </h3>
              <p className="text-gray-400 text-sm">
                Cumulative rankings across all contests
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!searchQuery && (
                <button
                  onClick={() => downloadPDF(filterResults(overallRankings), 'Coding_Circuit_Overall_Leaderboard')}
                  className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 px-4 py-2 rounded-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              )}
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2">
                <span className="text-cyan-400 font-bold text-lg">
                  {filterResults(overallRankings).length}
                </span>
                <span className="text-gray-400 text-sm ml-1">Participants</span>
              </div>
            </div>
          </div>
          {renderRankingsTable(overallRankings)}
        </div>

        {/* Visual Divider with Arrow Indicator */}
        {((viewMode === "contest" && selectedContest === "contest1") ||
          viewMode === "year") && (
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="flex items-center gap-3 w-full max-w-md">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-cyan-500/50"></div>
              <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-full p-2 animate-bounce">
                <ArrowDown className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-cyan-500/50 to-cyan-500/50"></div>
            </div>
            <p className="text-cyan-400 text-sm font-semibold">
              {viewMode === "contest"
                ? "Contest Specific Rankings Below"
                : "Year Specific Rankings Below"}
            </p>
          </div>
        )}

        {/* Contest or Year Specific Rankings */}
        {viewMode === "contest" && selectedContest === "contest1" && (
          <div
            ref={specificRankingsRef}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-cyan-500/20 rounded-xl p-6 scroll-mt-8"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
              <div>
                <h3 className="text-2xl font-bold text-cyan-400 mb-2">
                  Contest #1 Results
                </h3>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1 text-gray-400">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    September 5, 2025
                  </span>
                </div>
              </div>
              {!searchQuery && (
                <button
                  onClick={() => downloadPDF(filterResults(contest1Results), 'Coding_Circuit_Contest_1_Results')}
                  className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 px-4 py-2 rounded-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              )}
            </div>
            {renderRankingsTable(contest1Results)}
          </div>
        )}

        {viewMode === "year" && (
          <div
            ref={specificRankingsRef}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-cyan-500/20 rounded-xl p-6 scroll-mt-8"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
              <div>
                <h3 className="text-2xl font-bold text-cyan-400 mb-1">
                  {selectedYear === "1"
                    ? "1st"
                    : selectedYear === "2"
                    ? "2nd"
                    : selectedYear === "3"
                    ? "3rd"
                    : selectedYear === "4"
                    ? "4th"
                    : "Other"}{" "}
                  {selectedYear !== "other" ? "Year Rankings" : "Rankings"}
                </h3>
                <p className="text-gray-400 text-sm">
                  {selectedYear === "other"
                    ? "Leaderboard for 5th year, PG, PhD, and other students"
                    : `Leaderboard for ${selectedYear === "1" ? "1st" : selectedYear === "2" ? "2nd" : selectedYear === "3" ? "3rd" : "4th"} year students`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {!searchQuery && (
                  <button
                    onClick={() => {
                      const yearLabel = selectedYear === "1" ? "1st" : selectedYear === "2" ? "2nd" : selectedYear === "3" ? "3rd" : selectedYear === "4" ? "4th" : "Other";
                      downloadPDF(filterResults(getYearWiseRankings(selectedYear)), `Coding_Circuit_${yearLabel}_Year_Rankings`);
                    }}
                    className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 px-4 py-2 rounded-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                )}
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2">
                  <span className="text-cyan-400 font-bold text-lg">
                    {filterResults(getYearWiseRankings(selectedYear)).length}
                  </span>
                  <span className="text-gray-400 text-sm ml-1">Participants</span>
                </div>
              </div>
            </div>
            {renderRankingsTable(getYearWiseRankings(selectedYear))}
          </div>
        )}
      </section>

      {/* Call to Action - Split Layout */}
      {/* <section className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/20 to-cyan-500/10"></div>
        <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-12 border border-cyan-500/20">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Test Your Skills?
            </h2>
            <p className="text-lg text-gray-300">
              Join Coding Circuit and compete with the best programmers at IIT
              Bombay. Challenge yourself, track your progress, and earn your
              place on the leaderboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 font-semibold">
                <Trophy className="w-5 h-5" /> Register Now
              </button>
              <button className="border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-8 py-3 rounded-lg flex items-center justify-center gap-2 transition-all font-semibold">
                <Code className="w-5 h-5" /> View Problems
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-2xl blur-2xl"></div>
              <div className="relative bg-gray-900/80 border border-cyan-500/30 rounded-2xl p-8 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-cyan-500/20 p-2 rounded-lg">
                      <Zap className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="text-white font-semibold">
                      Weekly Contests
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-cyan-500/20 p-2 rounded-lg">
                      <Target className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="text-white font-semibold">
                      Live Rankings
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-cyan-500/20 p-2 rounded-lg">
                      <Trophy className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="text-white font-semibold">
                      Exciting Prizes
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-cyan-500/20 p-2 rounded-lg">
                      <Brain className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="text-white font-semibold">
                      Skill Development
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default CodingCircuit;
