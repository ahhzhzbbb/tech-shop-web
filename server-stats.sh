#!/bin/bash

echo "System Monitor Report"
echo "---------------------------------------------------------------------------------------"
echo "os version: $(uname -a)"
echo "uptime: $(w)"
echo "---------------------------------------------------------------------------------------"

echo ""

#Total CPU Usage
function cpu_usage() {
    top -bn1 | awk '/Cpu/ {printf "CPU Usage: %.1f%%\n", 100 - $8}'
}

#Total memory usage (Free vs Used including percentage)
function memory_usage() {
    top -bn1 | awk '/Mem :/ {
        free = 100*$6/$4;
        used = 100*$8/$4;
        cache = 100 - free - used;
        printf "Memory Usage: %.1f%% Free, %.1f%% Used, %.1f%% Cache\n", free, used, cache
    }'
}

#Total disk usage (Free vs Used including percentage)
function disk_usage() {
    df -h | awk '$6=="/" {printf "Disk Usage: %s\n", $5}'
}

#Top 5 processes by CPU usage
function top_5_processes_by_cpu_usage() {
    echo "Top 5 processes by CPU usage: "
    top -bn1 -o %CPU | tail -n +8 | head -5
}

#Top 5 processes by memory usage
function top_5_processes_by_memory_usage() {
    echo "Top 5 processes by memory usage"
    top -bn1 -o %MEM | tail -n +8 | head -5
}

function all_of_them() {
    cpu_usage
    memory_usage
    disk_usage
    echo ""
    echo "---------------------------------------------------------------------------------------"
    echo ""
    top_5_processes_by_cpu_usage
    top_5_processes_by_memory_usage
}

function help() {
    cat << EOF
    Please select:
        -h help

        -c Total CPU usage

        -m Total memory usage (Free vs Used including percentage)

        -d Total disk usage (Free vs Used including percentage)

        -P Top 5 processes by CPU usage

        -M Top 5 processes by memory usage

        -a All of them
EOF
}

while getopts "cmdPMha" opt; do
    case $opt in
        c) cpu_usage ;;
        m) memory_usage ;;
        d) disk_usage ;;
        P) top_5_processes_by_cpu_usage ;;
        M) top_5_processes_by_memory_usage ;;
        a) all_of_them ;;
        h) help ;;
        *) echo "Usage: $0 [-h] for help"
           exit 1 ;;
    esac
done

if [ $# -eq 0 ]; then
   echo "Usage: $0 [-h] for help"
   exit 1
fi

echo ""
echo "==========================================================================================="