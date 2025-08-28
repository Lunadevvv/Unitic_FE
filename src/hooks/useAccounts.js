import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchAllAccounts, 
  fetchAccountById, 
  fetchUniversities as fetchUniversitiesAdmin 
} from '../store/actions/adminActions';

export const useAccounts = () => {
  const dispatch = useDispatch();
  const { 
    accounts, 
    universities
  } = useSelector((state) => state.admin);

  const loadAccounts = () => {
    dispatch(fetchAllAccounts());
  };

  const loadAccountById = (userId) => {
    dispatch(fetchAccountById(userId));
  };

  const loadUniversities = () => {
    dispatch(fetchUniversitiesAdmin());
  };

  return {
    accounts: accounts.list,
    accountsTotal: accounts.total,
    selectedAccount: accounts.selectedAccount,
    accountsLoading: accounts.loading,
    accountsError: accounts.error,
    universities: universities.list,
    universitiesLoading: universities.loading,
    universitiesError: universities.error,
    loadAccounts,
    loadAccountById,
    loadUniversities
  };
};

export default useAccounts;
