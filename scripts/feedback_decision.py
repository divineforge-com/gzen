#!/usr/bin/env python3

import os
import json
from datetime import datetime

# Simple feedback and decision tracking mechanism

FEEDBACK_FILE = "FEEDBACK.md"
DECISIONS_FILE = "DECISIONS.md"

def add_feedback(source, content):
    """Add feedback to the feedback log."""
    date_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = f"## [{date_str}] Feedback from {source}\n\n{content}\n\n---\n"

    with open(FEEDBACK_FILE, "a") as f:
        f.write(entry)
    print(f"Added feedback to {FEEDBACK_FILE}")

def record_decision(title, context, decision, consequences):
    """Record an architectural or design decision (ADR style)."""
    date_str = datetime.now().strftime("%Y-%m-%d")

    # Check if file exists, if not create with header
    if not os.path.exists(DECISIONS_FILE):
        with open(DECISIONS_FILE, "w") as f:
            f.write("# Architecture and Design Decisions\n\n")

    # Get current decision count for numbering
    count = 1
    with open(DECISIONS_FILE, "r") as f:
        content = f.read()
        count = content.count("## ADR") + 1

    entry = f"""## ADR {count}: {title}

**Date**: {date_str}
**Status**: Accepted

### Context
{context}

### Decision
{decision}

### Consequences
{consequences}

---
"""

    with open(DECISIONS_FILE, "a") as f:
        f.write(entry)
    print(f"Recorded decision in {DECISIONS_FILE}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python feedback_decision.py [feedback|decision] [args...]")
        sys.exit(1)

    command = sys.argv[1]
    if command == "feedback" and len(sys.argv) == 4:
        add_feedback(sys.argv[2], sys.argv[3])
    elif command == "decision" and len(sys.argv) == 6:
        record_decision(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])
    else:
        print("Invalid arguments.")
