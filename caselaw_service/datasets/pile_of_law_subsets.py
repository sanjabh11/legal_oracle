from datasets import get_dataset_config_names

def get_pile_of_law_subsets():
    """Return the list of all valid subset names for pile-of-law/pile-of-law."""
    return get_dataset_config_names("pile-of-law/pile-of-law")

if __name__ == "__main__":
    print(get_pile_of_law_subsets())
