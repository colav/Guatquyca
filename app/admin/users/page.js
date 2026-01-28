"use client";

/* APIs */
import { getAdminUsers } from "@/lib/apis/admin.api";

/* Components */
import UsersTable from "./components/UsersTable";
import UserFormModal from "./components/UserFormModal";
import ForbiddenPage from "@/app/components/ClientSide/ForbiddenPage/ForbiddenPage";

/* Context */
import { useAuth } from "@/app/context/AuthContext";

/* Hooks */
import { useEffect, useState, useCallback } from "react";
import { useSessionExpired } from "@/lib/hooks/useSessionExpired";

/**
 * AdminUsersPage component
 *
 * Displays and manages the list of admin users.
 * Handles role-based access and permission errors (403).
 *
 * @component
 * @returns {JSX.Element}
 */
export default function AdminUsersPage() {
  const { user, loading } = useAuth();

  const [users, setUsers] = useState(null);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [mode, setMode] = useState("create");
  const [forbidden, setForbidden] = useState(false);

  const handleSessionExpired = useSessionExpired();
  const [institutionFilter, setInstitutionFilter] = useState("");

  const openCreate = () => {
    setMode("create");
    setEditingUser(null);
    setOpen(true);
  };

  const openEdit = (user) => {
    setMode("edit");
    setEditingUser(user);
    setOpen(true);
  };

  const loadUsers = useCallback(() => {
    getAdminUsers()
      .then(setUsers)
      .catch((err) => {
        if (err?.status === 401) {
          handleSessionExpired();
        }

        if (err?.status === 403) {
          setForbidden(true);
        }
      });
  }, [handleSessionExpired]);

  useEffect(() => {
    if (!loading && user?.role !== "admin") {
      setForbidden(true);
      return;
    }

    if (!loading) {
      loadUsers();
    }
  }, [loading, user, loadUsers]);

  if (loading) {
    return null;
  }

  if (forbidden) {
    return <ForbiddenPage />;
  }

  return (
    <>
      <UsersTable
        users={users}
        onRefresh={loadUsers}
        onCreateUser={openCreate}
        onEditUser={openEdit}
        institutionFilter={institutionFilter}
        onInstitutionFilterChange={setInstitutionFilter}
      />

      <UserFormModal
        open={open}
        mode={mode}
        user={editingUser}
        onClose={() => setOpen(false)}
        onCreated={loadUsers}
      />
    </>
  );
}
