import unittest
from datetime import date

from social_media_agent import BusinessProfile, SocialMediaAgent


class SocialMediaAgentTests(unittest.TestCase):
    def test_generates_7_day_plan_with_platform_rotation(self):
        profile = BusinessProfile(
            name="Corner Cafe",
            industry="cafe",
            platforms=["Instagram", "Facebook"],
            goals=["increasing weekday traffic"],
            keywords=["coffee", "pastries"],
            call_to_action="Stop by today!",
        )
        agent = SocialMediaAgent(profile)

        plan = agent.generate_weekly_plan(start_date=date(2026, 1, 1))

        self.assertEqual(7, len(plan))
        self.assertEqual("Instagram", plan[0].platform)
        self.assertEqual("Facebook", plan[1].platform)
        self.assertEqual(date(2026, 1, 1), plan[0].publish_date)
        self.assertIn("#coffee", plan[0].caption)

    def test_validates_required_profile_fields(self):
        with self.assertRaises(ValueError):
            SocialMediaAgent(
                BusinessProfile(
                    name="",
                    industry="salon",
                    platforms=["Instagram"],
                    goals=[],
                    keywords=[],
                    call_to_action="Book now",
                )
            )

        with self.assertRaises(ValueError):
            SocialMediaAgent(
                BusinessProfile(
                    name="Glow Salon",
                    industry="salon",
                    platforms=[],
                    goals=[],
                    keywords=[],
                    call_to_action="Book now",
                )
            )

    def test_x_captions_are_trimmed_to_platform_limit(self):
        profile = BusinessProfile(
            name="Green Grocer",
            industry="grocery",
            platforms=["X"],
            goals=["" * 250],
            keywords=["organicproduce" * 10],
            call_to_action="Shop local and save today with healthy weekly specials now available!",
        )
        agent = SocialMediaAgent(profile)

        caption = agent.generate_caption("X", "A" * 300)

        self.assertLessEqual(len(caption), 280)


if __name__ == "__main__":
    unittest.main()
