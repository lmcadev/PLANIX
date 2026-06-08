from django.test.runner import DiscoverRunner


class ProjectTestRunner(DiscoverRunner):
    def build_suite(self, test_labels=None, extra_tests=None, **kwargs):
        labels = test_labels or ["app"]
        return super().build_suite(labels, extra_tests=extra_tests, **kwargs)
