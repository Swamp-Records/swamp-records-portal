"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type MeetingStats = {
    meeting: { name: string; date: string };
    // percentages of members, the three should add up to 100
    attended: number;
    excused: number;
    unexcused: number;
};

type TickProps = {
    x?: number | string;
    y?: number | string;
    payload?: { value: string; index: number };
};

type DotProps = {
    cx?: number;
    cy?: number;
    index?: number;
};

const INK = "#000000";
const SURFACE = "#EDEDED";

// x axis label with the meeting name on top and its date underneath
function MeetingTick({ x, y, payload, data }: TickProps & { data: MeetingStats[] }) {
    if (!payload) return null;
    const date = data[payload.index]?.meeting.date;
    return (
        <text x={x} y={y} textAnchor="middle" fill={INK} fontSize={12}>
            <tspan x={x} dy="0.71em">{payload.value}</tspan>
            <tspan x={x} dy="1.2em">{date}</tspan>
        </text>
    );
}

// each line gets its own marker shape as well as its own dash pattern, so they can be told apart without color
function CircleDot({ cx, cy, index }: DotProps) {
    if (cx == null || cy == null) return null;
    return <circle key={index} cx={cx} cy={cy} r={4.5} fill={INK} stroke={SURFACE} strokeWidth={2} />;
}

function SquareDot({ cx, cy, index }: DotProps) {
    if (cx == null || cy == null) return null;
    return <rect key={index} x={cx - 4.5} y={cy - 4.5} width={9} height={9} fill={SURFACE} stroke={INK} strokeWidth={1.5} />;
}

function DiamondDot({ cx, cy, index }: DotProps) {
    if (cx == null || cy == null) return null;
    return <polygon key={index} points={`${cx},${cy - 5.5} ${cx + 5.5},${cy} ${cx},${cy + 5.5} ${cx - 5.5},${cy}`} fill={SURFACE} stroke={INK} strokeWidth={1.5} />;
}

const series = [
    { key: "attended", name: "Attended", dash: undefined, width: 2, Dot: CircleDot },
    { key: "excused", name: "Excused absences", dash: "6 4", width: 1.5, Dot: SquareDot },
    { key: "unexcused", name: "Unexcused absences", dash: "2 4", width: 1.5, Dot: DiamondDot },
] as const;

export default function AttendanceChart({ data }: { data: MeetingStats[] }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 24, bottom: 0, left: 8 }}>
                <CartesianGrid vertical={false} stroke="#BBBBBB" />
                {/* taller than the default so the second line of each label isn't cut off */}
                <XAxis
                    dataKey="meeting.name"
                    tick={(props: TickProps) => <MeetingTick {...props} data={data} />}
                    height={50}
                    interval={0}
                    stroke={INK}
                    tickLine={false}
                    label={{ value: "Meeting", position: "insideBottom", offset: -2, fill: INK, fontSize: 12 }}
                />
                <YAxis
                    domain={[0, 100]}
                    ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                    tickFormatter={(v: number) => `${v}%`}
                    width="auto"
                    stroke={INK}
                    tick={{ fill: INK, fontSize: 12 }}
                    tickLine={false}
                    label={{ value: "Percentage of members", angle: -90, position: "insideLeft", fill: INK, fontSize: 12, style: { textAnchor: "middle" } }}
                />
                <Tooltip
                    formatter={(value) => `${value}%`}
                    labelFormatter={(name, payload) => `${name} (${payload?.[0]?.payload.meeting.date ?? ""})`}
                    contentStyle={{ backgroundColor: "#FFFFFF", border: `2px solid ${INK}`, borderRadius: 10, fontSize: 12 }}
                    labelStyle={{ color: INK, fontWeight: "bold" }}
                    cursor={{ stroke: INK, strokeDasharray: "3 3" }}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: INK, paddingTop: 8 }} />
                {series.map(({ key, name, dash, width, Dot }) => (
                    <Line
                        key={key}
                        type="linear"
                        dataKey={key}
                        name={name}
                        stroke={INK}
                        strokeWidth={width}
                        strokeDasharray={dash}
                        dot={(props: DotProps) => <Dot {...props} />}
                        activeDot={(props: DotProps) => <Dot {...props} />}
                        isAnimationActive={false}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
}
