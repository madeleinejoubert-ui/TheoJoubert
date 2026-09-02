from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta
from typing import Iterable, List


@dataclass(frozen=True)
class BusinessProfile:
    name: str
    industry: str
    platforms: List[str]
    goals: List[str]
    keywords: List[str]
    call_to_action: str


@dataclass(frozen=True)
class ContentPlanItem:
    publish_date: date
    platform: str
    topic: str
    caption: str


class SocialMediaAgent:
    def __init__(self, profile: BusinessProfile):
        if not profile.name.strip():
            raise ValueError("Business name is required.")
        if not profile.platforms:
            raise ValueError("At least one platform is required.")
        self.profile = profile

    def generate_weekly_plan(self, start_date: date | None = None) -> List[ContentPlanItem]:
        start = start_date or date.today()
        topics = self._build_topics()
        plan: List[ContentPlanItem] = []

        for day_offset in range(7):
            publish_date = start + timedelta(days=day_offset)
            platform = self.profile.platforms[day_offset % len(self.profile.platforms)]
            topic = topics[day_offset % len(topics)]
            caption = self.generate_caption(platform=platform, topic=topic)
            plan.append(
                ContentPlanItem(
                    publish_date=publish_date,
                    platform=platform,
                    topic=topic,
                    caption=caption,
                )
            )
        return plan

    def generate_caption(self, platform: str, topic: str) -> str:
        hashtags = " ".join(f"#{word.replace(' ', '')}" for word in self._top_keywords(3))
        base = f"{self.profile.name}: {topic}. {self.profile.call_to_action} {hashtags}".strip()
        if platform.lower() == "x" and len(base) > 280:
            return base[:277].rstrip() + "..."
        return base

    def _build_topics(self) -> List[str]:
        goals = self.profile.goals or ["build local awareness"]
        topics = [
            f"How {self.profile.name} helps with {goal}"
            for goal in goals
        ]
        topics.append(f"Behind the scenes at a {self.profile.industry} business")
        return topics

    def _top_keywords(self, limit: int) -> Iterable[str]:
        keywords = [word for word in self.profile.keywords if word.strip()]
        if not keywords:
            return [self.profile.industry]
        return keywords[:limit]


if __name__ == "__main__":
    profile = BusinessProfile(
        name="Lakeside Bakery",
        industry="bakery",
        platforms=["Instagram", "Facebook", "X"],
        goals=["promoting seasonal specials", "driving in-store visits"],
        keywords=["fresh bread", "family owned", "local bakery"],
        call_to_action="Visit us this week!",
    )
    agent = SocialMediaAgent(profile)
    for item in agent.generate_weekly_plan():
        print(f"{item.publish_date} | {item.platform} | {item.topic}")
        print(f"  {item.caption}")
