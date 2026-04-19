"""
Cross-schema referential integrity check for STAMPED.

Verifies that:
  1. Checklist.principles_version == PrincipleSet.version
  2. Every principle_code referenced in the checklist exists
     in the principles instance.

Pattern validation is delegated to linkml-validate.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Check referential integrity between a STAMPED principles "
            "instance and a STAMPED checklist instance."
        )
    )
    parser.add_argument(
        "--principles",
        type=Path,
        required=True,
        help="Path to the principles JSON instance (PrincipleSet).",
    )
    parser.add_argument(
        "--checklist",
        type=Path,
        required=True,
        help="Path to the checklist JSON instance (Checklist).",
    )
    return parser.parse_args()


def report_error(message: str) -> None:
    print(f"::error::{message}", file=sys.stderr)


def check_version_alignment(
    principles: dict,
    checklist: dict,
) -> list[str]:
    principles_version = principles.get("version")
    referenced_version = checklist.get("principles_version")
    if principles_version != referenced_version:
        return [
            f"Version mismatch: principles={principles_version!r} "
            f"but checklist.principles_version={referenced_version!r}"
        ]
    return []


def check_referenced_codes(
    principles: dict,
    checklist: dict,
) -> list[str]:
    errors: list[str] = []
    valid_codes = {
        principle["code"] for principle in principles.get("principles", [])
    }

    for level_group in checklist.get("data", []):
        level = level_group.get("level", "?")
        for entry in level_group.get("entries", []):
            for referenced_code in entry.get("principle_codes", []):
                if referenced_code not in valid_codes:
                    errors.append(
                        f"Unknown principle code {referenced_code!r} "
                        f"referenced in level={level} entry "
                        f"(not defined in principles instance)"
                    )
    return errors


def main() -> int:
    args = parse_args()

    try:
        principles = json.loads(args.principles.read_text())
    except (OSError, json.JSONDecodeError) as exc:
        report_error(f"Failed to load {args.principles}: {exc}")
        return 2

    try:
        checklist = json.loads(args.checklist.read_text())
    except (OSError, json.JSONDecodeError) as exc:
        report_error(f"Failed to load {args.checklist}: {exc}")
        return 2

    errors: list[str] = []
    errors.extend(check_version_alignment(principles, checklist))
    errors.extend(check_referenced_codes(principles, checklist))

    if errors:
        for message in errors:
            report_error(message)
        print(
            f"\n{len(errors)} consistency error(s) found.",
            file=sys.stderr,
        )
        return 1

    principles_version = principles.get("version")
    valid_codes = {
        principle["code"] for principle in principles.get("principles", [])
    }
    print("✓ Principles and checklist are consistent.")
    print(f"  principles file:       {args.principles}")
    print(f"  checklist file:        {args.checklist}")
    print(f"  principles version:    {principles_version}")
    print(f"  principle codes known: {len(valid_codes)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
