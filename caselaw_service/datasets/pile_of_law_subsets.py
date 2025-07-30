import datasets as hf_datasets

def get_pile_of_law_subsets():
    """Return the list of all valid subset names for pile-of-law/pile-of-law."""
    return hf_datasets.get_dataset_config_names("pile-of-law/pile-of-law")

if __name__ == "__main__":
    print(get_pile_of_law_subsets())
