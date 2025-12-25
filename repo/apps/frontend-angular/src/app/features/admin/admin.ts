import { Injectable } from '@angular/core';
import { supabase } from "@repo/supabase"
@Injectable({
  providedIn: 'root',
})
export class Admin {

  async registerUser(email: string, password: string, qrCode: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { invited_code: qrCode }
      }
    })
    return { data, error }
  }

}
