"use client";

/* APIs */
import { getAdminUsers } from "@/lib/apis/admin.api";

/* Components */
import UsersTable from "./components/UsersTable";
import UserFormModal from "./components/UserFormModal";

/* Hooks */
import { useEffect, useState, useCallback } from "react";
import { useSessionExpired } from "@/lib/hooks/useSessionExpired";

/**
 * AdminUsersPage component
 *
 * Displays and manages the list of users for the platform.
 * Handles user creation, editing, filtering by institution, and session expiration.
 *
 * Uses UsersTable for listing and UserFormModal for user creation/editing.
 *
 * @component
 * @returns {JSX.Element} The admin users management page
 */
export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [mode, setMode] = useState("create");

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
      });
  }, [handleSessionExpired]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

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
